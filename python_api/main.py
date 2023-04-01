from flask import Flask, abort, jsonify, request
from flask_cors import CORS
from flask_restful import Api, Resource
import pandas as pd

from sqlalchemy import create_engine, select, text
from sqlalchemy import MetaData, Table

from config import DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, DEBUG


app = Flask(__name__)
CORS(app)
api = Api(app)

# Configure SQLAlchemy
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)
metadata_obj = MetaData()
metadata_obj.reflect(bind=engine)

# Load the tables
Player = Table("Player", metadata_obj, autoload_with=engine)
Attempt = Table("Attempt", metadata_obj, autoload_with=engine)
Foul = Table("Foul", metadata_obj, autoload_with=engine)
Game = Table("Game", metadata_obj, autoload_with=engine)
Gameday = Table("Gameday", metadata_obj, autoload_with=engine)
Player = Table("Player", metadata_obj, autoload_with=engine)
Team = Table("Team", metadata_obj, autoload_with=engine)
TeamsInGame = Table("_teamsInGame", metadata_obj, autoload_with=engine)
GamedayToPlayer = Table("_GamedayToPlayer", metadata_obj, autoload_with=engine)
PlayerToTeam = Table("_PlayerToTeam", metadata_obj, autoload_with=engine)


def get_players_in_team_df():
    stmt = select(PlayerToTeam)
    with engine.connect() as conn:
        result = conn.execute(stmt)
        df = pd.DataFrame(result.fetchall(), columns=result.keys())
        return df.rename(columns={'A': 'playerId', 'B': 'teamId'})


def get_teams_in_game_df():
    stmt = select(TeamsInGame)
    with engine.connect() as conn:
        result = conn.execute(stmt)
        df = pd.DataFrame(result.fetchall(), columns=result.keys())
        return df.rename(columns={'A': 'gameId', 'B': 'teamId'})


def get_players_df():
    stmt = select(Player)
    with engine.connect() as conn:
        result = conn.execute(stmt)
        return pd.DataFrame(result.fetchall(), columns=result.keys())


@app.route("/usersGoals")
def usersGoals():
    stmt = (
        select(Player.c.id, Player.c.name, Attempt.c.shooterId, Attempt.c.goal)
        .select_from(Player.join(Attempt, Player.c.id == Attempt.c.shooterId))
        .where(Attempt.c.goal == True)
    )
    # Execute the statement and fetch the rows into a pandas DataFrame
    with engine.connect() as conn:
        result = conn.execute(stmt)
        df = pd.DataFrame(result.fetchall(), columns=result.keys())
    # Group the data by player and count the number of goals
    goals_by_player = df.groupby(
        ["id", "name"]).size().reset_index(name="goals")
    # Convert the DataFrame to a list of dictionaries
    goals_by_player_list = goals_by_player.to_dict(orient="records")
    return jsonify(goals_by_player_list)


@app.route('/stats/player/<id>')  # TODO
def playerStats(id):
    return id


@app.route('/attemptsGoalsByTime')
def attemptsGoalsByTime():
    stmt = (
        select(Attempt.c.id, Attempt.c.gameId, Attempt.c.goal, Attempt.c.time)
        .where(Attempt.c.time != None)
    )
    with engine.connect() as conn:
        result = conn.execute(stmt)
        df_attempts = pd.DataFrame(result.fetchall(), columns=result.keys())
    attempts_by_time = df_attempts.groupby(
        "time").size().reset_index(name="attempts")
    goals_by_time = df_attempts[df_attempts["goal"]].groupby(
        "time").size().reset_index(name="goals")
    time_data = pd.merge(attempts_by_time, goals_by_time, on="time")
    total_games = df_attempts["gameId"].nunique()
    time_data["avg_attempts"] = time_data["attempts"] / total_games
    time_data["avg_goals"] = time_data["goals"] / total_games
    return jsonify(time_data.to_dict(orient="records"))


@app.route('/goalsPerGame')
def goals_per_game():
    min_game_count = request.args.get('min_game_count')
    if min_game_count is None:
        abort(400)
    min_game_count = int(min_game_count)
    players_in_team_df = get_players_in_team_df()
    teams_in_game_df = get_teams_in_game_df()
    players_df = get_players_df()
    stmt = select(Attempt).where(Attempt.c.goal == True)
    with engine.connect() as conn:
        result = conn.execute(stmt)
        attempts_goals = pd.DataFrame(result.fetchall(), columns=result.keys())
    goals_by_player_id = attempts_goals.groupby(
        'shooterId').size().reset_index(name='count')
    player_games = pd.merge(players_in_team_df, teams_in_game_df, on='teamId')
    player_games_count = player_games.groupby(
        'playerId').gameId.nunique().reset_index(name='gamesPlayed')
    player_games_count = player_games_count.loc[player_games_count['gamesPlayed']
                                                >= min_game_count]
    goals_per_game = pd.merge(goals_by_player_id, player_games_count,
                              left_on='shooterId', right_on='playerId').drop('shooterId', axis=1)
    goals_per_game['goalsPerGame'] = goals_per_game['count'] / \
        goals_per_game['gamesPlayed']
    goals_per_game = pd.merge(goals_per_game, players_df,
                              left_on='playerId', right_on='id').drop('playerId', axis=1)
    goals_per_game_sorted = goals_per_game.sort_values(
        'goalsPerGame', ascending=False)
    return jsonify(goals_per_game_sorted.to_dict(orient='records'))


@app.route('/cardsPerGame')
def red_cards_per_game():
    limit = request.args.get('limit')
    color = request.args.get('color')
    if color != 'yellow':
        color = 'red'
    players_in_team_df = get_players_in_team_df()
    teams_in_game_df = get_teams_in_game_df()
    players_df = get_players_df()
    stmt = select(Foul).where(Foul.c.card == color)
    with engine.connect() as conn:
        result = conn.execute(stmt)
        red_fouls_df = pd.DataFrame(result.fetchall(), columns=result.keys())
    red_cards = red_fouls_df.groupby(
        'playerId').size().reset_index(name='count')
    player_games = pd.merge(players_in_team_df, teams_in_game_df, on='teamId')
    player_games_count = player_games.groupby(
        'playerId').gameId.nunique().reset_index(name='gamesPlayed')
    red_cards_per_game = pd.merge(player_games_count, red_cards, on='playerId')
    red_cards_per_game['red_cards_per_game'] = red_cards_per_game['count'] / \
        red_cards_per_game['gamesPlayed']
    red_cards_per_game = pd.merge(
        red_cards_per_game, players_df, left_on='playerId', right_on='id')
    red_cards_per_game = red_cards_per_game.sort_values(
        'red_cards_per_game', ascending=False)
    if limit is None:
        return jsonify(red_cards_per_game.to_dict(orient='records'))
    elif limit is not None:
        top_3 = red_cards_per_game.head(int(limit))
        return jsonify(top_3.to_dict(orient='records'))


if __name__ == "__main__":
    app.run(debug=DEBUG)

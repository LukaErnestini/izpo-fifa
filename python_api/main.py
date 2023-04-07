from flask import Flask, abort, jsonify, request
from flask_cors import CORS
from flask_restful import Api, Resource
import pandas as pd
import numpy as np
import collections
import os

from sqlalchemy import create_engine, select, text
from sqlalchemy import MetaData, Table

from config import DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, DEBUG


# Get values from environment variables, fall back to config.py if not set
db_user = os.environ.get('DB_USER', DB_USER)
db_password = os.environ.get('DB_PASSWORD', DB_PASSWORD)
db_host = os.environ.get('DB_HOST', DB_HOST)
db_port = os.environ.get('DB_PORT', DB_PORT)
db_name = os.environ.get('DB_NAME', DB_NAME)


app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
CORS(app)
api = Api(app)

# Configure SQLAlchemy
DATABASE_URL = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
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
GamedayToPlayer = Table("_GamedayToPlayer", metadata_obj, autoload_with=engine)
PlayerToTeam = Table("_PlayerToTeam", metadata_obj, autoload_with=engine)


def get_players_in_team_df():
    stmt = select(PlayerToTeam)
    with engine.connect() as conn:
        result = conn.execute(stmt)
        df = pd.DataFrame(result.fetchall(), columns=result.keys())
        return df.rename(columns={'A': 'playerId', 'B': 'teamId'})


def get_players_df():
    stmt = select(Player)
    with engine.connect() as conn:
        result = conn.execute(stmt)
        return pd.DataFrame(result.fetchall(), columns=result.keys())


def get_attempts_df():
    stmt = select(Attempt)
    with engine.connect() as conn:
        result = conn.execute(stmt)
        return pd.DataFrame(result.fetchall(), columns=result.keys())


def get_games_df():
    stmt = select(Game)
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
    games_df = get_games_df()
    players_df = get_players_df()

    # Create a long format of the games_df
    teamA = games_df[['id', 'teamAId']].rename(
        columns={'id': 'gameId', 'teamAId': 'teamId'})
    teamB = games_df[['id', 'teamBId']].rename(
        columns={'id': 'gameId', 'teamBId': 'teamId'})
    long_games_df = pd.concat([teamA, teamB])

    # Fetch attempts that resulted in a goal
    stmt = select(Attempt).where(Attempt.c.goal == True)
    with engine.connect() as conn:
        result = conn.execute(stmt)
        attempts_goals = pd.DataFrame(result.fetchall(), columns=result.keys())

    goals_by_player_id = attempts_goals.groupby(
        'shooterId').size().reset_index(name='count')
    player_games = pd.merge(players_in_team_df, long_games_df, on='teamId')
    player_games_count = player_games.groupby(
        'playerId').gameId.nunique().reset_index(name='gamesPlayed')
    # Drop rows where the count of games played is too low
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


@app.route('/overallTables')
def overall_tables():
    dfGame = get_games_df()
    gamedayId = request.args.get('gameday_id')
    if (gamedayId):
        dfGame = dfGame[dfGame['gamedayId'] == int(gamedayId)]
    allTeamIds = np.concatenate((dfGame["teamAId"], dfGame["teamBId"]))
    allTeamIdsUniq = np.unique(allTeamIds)
    MPcounter = collections.Counter(allTeamIds)
    MPs = []
    for tId in allTeamIdsUniq:
        MPs.append(MPcounter.get(tId))
    winners = []
    losers = []
    draws = []
    for row in dfGame.index:
        if dfGame.loc[row, "scoreTeamA"] > dfGame.loc[row, "scoreTeamB"]:
            winners.append(dfGame.loc[row, "teamAId"])
            losers.append(dfGame.loc[row, "teamBId"])
        elif dfGame.loc[row, "scoreTeamB"] > dfGame.loc[row, "scoreTeamA"]:
            winners.append(dfGame.loc[row, "teamBId"])
            losers.append(dfGame.loc[row, "teamAId"])
        else:
            draws.append(dfGame.loc[row, "teamBId"])
            draws.append(dfGame.loc[row, "teamAId"])
    Ws = []
    for tId in allTeamIdsUniq:
        Ws.append(collections.Counter(winners).get(tId))
    Ls = []
    for tId in allTeamIdsUniq:
        Ls.append(collections.Counter(losers).get(tId))
    Ds = []
    for tId in allTeamIdsUniq:
        Ds.append(collections.Counter(draws).get(tId))
    dfTeamOverall = pd.DataFrame(columns=[
                                 "Rank", "TeamID", "Team", "MP", "W", "D", "L", "Pts", "Pts/MP", "GF", "GA", "GF/MP", "GA/MP"])
    dfTeamOverall["TeamID"] = allTeamIdsUniq
    dfTeamOverall["MP"] = MPs
    dfTeamOverall["W"] = Ws
    dfTeamOverall["D"] = Ds
    dfTeamOverall["L"] = Ls
    dfTeamOverall["W"] = dfTeamOverall["W"].fillna(0)
    dfTeamOverall["D"] = dfTeamOverall["D"].fillna(0)
    dfTeamOverall["L"] = dfTeamOverall["L"].fillna(0)
    dfTeamOverall["W"] = dfTeamOverall["W"].astype(int)
    dfTeamOverall["D"] = dfTeamOverall["D"].astype(int)
    dfTeamOverall["L"] = dfTeamOverall["L"].astype(int)
    dfTeamOverall["Pts"] = dfTeamOverall["W"]*3 + dfTeamOverall["D"]
    dfTeamOverall["Pts/MP"] = (dfTeamOverall["Pts"] /
                               dfTeamOverall["MP"]).astype(float).round(2)
    GFs = []
    GAs = []
    for tId in allTeamIdsUniq:
        GFs.append(dfGame.loc[dfGame["teamAId"] == tId, "scoreTeamA"].sum(
        ) + dfGame.loc[dfGame["teamBId"] == tId, "scoreTeamB"].sum())
        GAs.append(dfGame.loc[dfGame["teamAId"] == tId, "scoreTeamB"].sum(
        ) + dfGame.loc[dfGame["teamBId"] == tId, "scoreTeamA"].sum())
    dfTeamOverall["GF"] = GFs
    dfTeamOverall["GA"] = GAs
    dfTeamOverall["GF/MP"] = (dfTeamOverall["GF"] /
                              dfTeamOverall["MP"]).astype(float).round(2)
    dfTeamOverall["GA/MP"] = (dfTeamOverall["GA"] /
                              dfTeamOverall["MP"]).astype(float).round(2)
    player_to_team = get_players_in_team_df()
    plyrs = get_players_df()
    pIds = []
    for tId in allTeamIdsUniq:
        pIds.append(
            player_to_team.loc[player_to_team["teamId"] == tId, "playerId"].values)
    dfNames = pd.DataFrame()
    dfNames["team_ids"] = allTeamIdsUniq
    dfNames["player_ids"] = pIds
    playerNames = []
    for arr in dfNames["player_ids"].values:
        team_n = []
        for val in arr:
            team_n.append(plyrs.loc[plyrs["id"] == val, "name"].values[0])
        playerNames.append(team_n)
    dfNames["team_names"] = playerNames
    team_names_final = []
    for arr in dfNames["team_names"].values:
        if len(arr) == 1:
            team_names_final.append(arr[0])
        else:
            team_names_final.append(arr[0][0:3]+arr[1][0:3])
    dfNames["team_names_final"] = team_names_final
    dfTeamOverall["Team"] = team_names_final
    dfTeamOverall = dfTeamOverall.sort_values("Pts", ascending=False)
    dfTeamOverall.index = np.arange(len(dfTeamOverall.index))
    dfTeamOverall["Rank"] = dfTeamOverall.index + 1
    players = get_players_df()
    dfPlayerOverall = pd.DataFrame(columns=[
                                   "Rank", "PlayerID", "Player", "MP", "W", "D", "L", "Pts", "Pts/MP", "GF", "GA", "GD", "GF/MP", "GA/MP"])
    pIds = []
    nms = []
    for arr in dfNames["player_ids"].values:
        for val in arr:
            if val not in pIds:
                pIds.append(val)
                nms.append(players.loc[players["id"] == val, "name"].values[0])
    dfPlayerOverall["PlayerID"] = pIds
    dfPlayerOverall["Player"] = nms
    for pId in dfPlayerOverall["PlayerID"].values:
        plMP = 0
        plW = 0
        plD = 0
        plL = 0
        plGF = 0
        plGA = 0
        plTeams = list(
            player_to_team.loc[player_to_team["playerId"] == pId, "teamId"].values)
        for tmId in plTeams:
            if (tmId in dfTeamOverall["TeamID"].values):
                # print(dfTeamOverall.loc[dfTeamOverall["TeamID"] == tmId, "MP"])
                plMP = plMP + \
                    dfTeamOverall.loc[dfTeamOverall["TeamID"]
                                      == tmId, "MP"].values[0]
                plW = plW + \
                    dfTeamOverall.loc[dfTeamOverall["TeamID"]
                                      == tmId, "W"].values[0]
                plD = plD + \
                    dfTeamOverall.loc[dfTeamOverall["TeamID"]
                                      == tmId, "D"].values[0]
                plL = plL + \
                    dfTeamOverall.loc[dfTeamOverall["TeamID"]
                                      == tmId, "L"].values[0]
                plGF = plGF + \
                    dfTeamOverall.loc[dfTeamOverall["TeamID"]
                                      == tmId, "GF"].values[0]
                plGA = plGA + \
                    dfTeamOverall.loc[dfTeamOverall["TeamID"]
                                      == tmId, "GA"].values[0]
        dfPlayerOverall.loc[dfPlayerOverall["PlayerID"] == pId, "MP"] = plMP
        dfPlayerOverall.loc[dfPlayerOverall["PlayerID"] == pId, "W"] = plW
        dfPlayerOverall.loc[dfPlayerOverall["PlayerID"] == pId, "D"] = plD
        dfPlayerOverall.loc[dfPlayerOverall["PlayerID"] == pId, "L"] = plL
        dfPlayerOverall.loc[dfPlayerOverall["PlayerID"] == pId, "GF"] = plGF
        dfPlayerOverall.loc[dfPlayerOverall["PlayerID"] == pId, "GA"] = plGA
    dfPlayerOverall["Pts"] = dfPlayerOverall["W"]*3 + dfPlayerOverall["D"]
    dfPlayerOverall["Pts/MP"] = (dfPlayerOverall["Pts"] /
                                 dfPlayerOverall["MP"]).astype(float).round(2)
    dfPlayerOverall["GF/MP"] = (dfPlayerOverall["GF"] /
                                dfPlayerOverall["MP"]).astype(float).round(2)
    dfPlayerOverall["GA/MP"] = (dfPlayerOverall["GA"] /
                                dfPlayerOverall["MP"]).astype(float).round(2)
    dfPlayerOverall["GD"] = dfPlayerOverall["GF"] - dfPlayerOverall["GA"]
    dfPlayerOverall = dfPlayerOverall.sort_values("Pts", ascending=False)
    dfPlayerOverall.index = np.arange(len(dfPlayerOverall.index))
    dfPlayerOverall["Rank"] = dfPlayerOverall.index + 1
    dfPlayerOverall.replace(np.inf, 0, inplace=True)
    df = get_attempts_df()
    df = df[df['gameId'].isin(dfGame['id'])]
    dfShots = pd.DataFrame(columns=["Rank", "PlayerID", "Player",
                           "MP", "G", "G/MP", "A", "A/MP", "S", "S/MP", "SoT/MP", "S/G"])
    dfShots["Player"] = dfPlayerOverall["Player"]
    dfShots["PlayerID"] = dfPlayerOverall["PlayerID"]
    dfShots["MP"] = dfPlayerOverall["MP"]
    shots = []
    for pId in dfShots["PlayerID"].values:
        shots.append(
            len(df.loc[(df["penalty"] == False) & (df["shooterId"] == pId), "shooterId"]))
    dfShots["S"] = shots
    goals = []
    for pId in dfShots["PlayerID"].values:
        goals.append(len(df.loc[(df["penalty"] == False) & (
            df["shooterId"] == pId) & (df["goal"] == True), "shooterId"]))
    dfShots["G"] = goals
    sots = []
    for pId in dfShots["PlayerID"].values:
        sots.append(len(df.loc[(df["penalty"] == False) & (
            df["shooterId"] == pId) & (df["onTarget"] == True), "shooterId"]))
    dfShots["SoT/MP"] = (sots/dfShots["MP"]).astype(float).round(2)
    assists = []
    for pId in dfShots["PlayerID"].values:
        assists.append(len(df.loc[(df["penalty"] == False) & (
            df["assistedId"] == pId) & (df["goal"] == True), "shooterId"]))
    dfShots["A"] = assists
    dfShots["G/MP"] = (dfShots["G"] / dfShots["MP"]).astype(float).round(2)
    dfShots["A/MP"] = (dfShots["A"] / dfShots["MP"]).astype(float).round(2)
    dfShots["S/MP"] = (dfShots["S"] / dfShots["MP"]).astype(float).round(2)
    dfShots["S/G"] = (dfShots["S"] / dfShots["G"]).astype(float).round(2)
    dfShots.replace(np.inf, 0, inplace=True)
    dfShots = dfShots.sort_values("G", ascending=False)
    dfShots.index = np.arange(len(dfShots.index))
    dfShots["Rank"] = dfShots.index + 1
    data = {}
    dfTeamOverall.drop(columns=['TeamID'], inplace=True)
    dfPlayerOverall.drop(columns=['PlayerID'], inplace=True)
    dfShots.drop(columns=['PlayerID'], inplace=True)
    # Replace NaN values with None in all DataFrames
    dfTeamOverall = dfTeamOverall.replace({np.nan: None})
    dfPlayerOverall = dfPlayerOverall.replace({np.nan: None})
    dfShots = dfShots.replace({np.nan: None})
    data['teams'] = dfTeamOverall.to_dict(orient="records")
    data['players'] = dfPlayerOverall.to_dict(orient="records")
    data['shots'] = dfShots.to_dict(orient="records")
    return jsonify(data)


@app.route('/cardsPerGame')
def red_cards_per_game():
    limit = request.args.get('limit')
    color = request.args.get('color')
    if color != 'yellow':
        color = 'red'
    stmt = select(Foul).where(Foul.c.card == color)
    with engine.connect() as conn:
        result = conn.execute(stmt)
        red_fouls_df = pd.DataFrame(result.fetchall(), columns=result.keys())
    red_cards = red_fouls_df.groupby(
        'playerId').size().reset_index(name='count')
    players_in_team_df = get_players_in_team_df()
    games_df = get_games_df()
    players_df = get_players_df()
    teamA = games_df[['id', 'teamAId']].rename(
        columns={'id': 'gameId', 'teamAId': 'teamId'})
    teamB = games_df[['id', 'teamBId']].rename(
        columns={'id': 'gameId', 'teamBId': 'teamId'})
    long_games_df = pd.concat([teamA, teamB])
    player_games = pd.merge(players_in_team_df, long_games_df, on='teamId')
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

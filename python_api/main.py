from flask import Flask, jsonify
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
    goals_by_player = df.groupby(["id", "name"]).size().reset_index(name="goals")
     # Convert the DataFrame to a list of dictionaries
    goals_by_player_list = goals_by_player.to_dict(orient="records")    
    return jsonify(goals_by_player_list)

# TODO
@app.route('/stats/player/<id>')
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
    attempts_by_time = df_attempts.groupby("time").size().reset_index(name="attempts")
    goals_by_time = df_attempts[df_attempts["goal"]].groupby("time").size().reset_index(name="goals")
    time_data = pd.merge(attempts_by_time, goals_by_time, on="time")
    total_games = df_attempts["gameId"].nunique()
    time_data["avg_attempts"] = time_data["attempts"] / total_games
    time_data["avg_goals"] = time_data["goals"] / total_games
    return jsonify(time_data.to_dict(orient="records"))


if __name__ == "__main__":
    app.run(debug=DEBUG)
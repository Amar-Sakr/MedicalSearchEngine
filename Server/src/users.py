from re import search
from flask import Flask, request, json
from pymongo import MongoClient
from datetime import datetime
import bcrypt
from pymongo.message import query

CONNECTION_STRING = "mongodb+srv://admin:admin@cluster0.wfb08.mongodb.net/users?retryWrites=true&w=majority"
client = MongoClient(CONNECTION_STRING, ssl=True, ssl_cert_reqs='CERT_NONE')
db_signup = client.users['user'] # signup collection
db_history = client.history # history database
""" , connectTimeoutMS=20000, socketTimeoutMS=20000 """
class User:

    def signup():
        data = request.json
        data['password']= bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        user = {
            "name": data['name'],
            "email": data['email'],
            "password": data['password']
        }
        if db_signup.find_one({"email": data['email'] }):
            return json.jsonify({"error":"Email address already in use", "status":400}), 400

        if db_signup.insert_one(user):
            data['password']= str(data['password'])
            data['status']=200
            return json.jsonify(data), 200
        
        return json.jsonify({"error":"SignUp failed"}), 400


    def signin():
        print(str(datetime.now()))
        history = {
            "action": "login",
            "time": str(datetime.now())
        }
        data = request.json
        if db_signup.find_one({"email": data['email'] }):
            courser = db_signup.find( {"email": data['email']} )
            for document in courser:
                data['name'] = document['name'] 
                if not bcrypt.checkpw( data['password'].encode('utf-8'), document['password']):
                    return json.jsonify({"error":"invalid password", "status":400}), 400
            if db_history[data['email']].insert_one(history):
                data['password']= str( bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()) )
                data['status']=200
                print(str(datetime.now()))
            return json.jsonify(data), 200
        else:
            return json.jsonify({"error":"you are not on our system", "status":400}), 400
        return json.jsonify({"error":"SignIn failed"}), 400


    def logout():
        history = {
            "action": "logout",
            "time": str(datetime.now())
        } 
        data = request.json
        if db_history[data['email']].insert_one(history):
            return json.jsonify({"action":"you are logged out", "status":200}), 200


    def search_data():
        data = request.json
        search = {
            "action": "search",
            "search_Query":data['query'],
            "result":data['pages'],
            "time": str(datetime.now())
        }
        if db_history[data['email']].insert_one(search):
            return json.jsonify({"action":"get doc", "status":200}), 200
    

    def get_article():
        data = request.json
        search = {
            "action": "get_article",
            "article": {
                "search_Query":data['search_Query'],
                "title":data['title'],
                "url":data['url']
            },
            "time": str(datetime.now())
        }
        #User.user_search_docs.append({ data['search_Query']: {"title":data['title'],"url":data['url']} })
        if db_history[data['email']].insert_one(search):
            return json.jsonify({"action":"get doc", "status":200}), 200

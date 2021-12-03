from datetime import date
from re import X
from flask import Flask, request, json
from flask_cors import CORS
from random import randrange
from search_engine import SearchEngine
from users import User


app = Flask(__name__)
CORS(app)
search_obj = SearchEngine()

@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/signup/', methods=['POST'])
def signup():
    return User.signup()


@app.route('/login/', methods=['POST'])
def login():
    return User.signin()


@app.route('/logout/', methods=['POST'])
def logout():
    return User.logout()

@app.route('/search_data/', methods=['POST'])
def search_data():
    return User.search_data()


@app.route('/get_article/', methods=['POST'])
def get_article():
    return User.get_article()


def random():
    return randrange(50,100)

@app.route('/search_query/', methods=['GET'])
def search_query():
    try:
        request_json = request.args.to_dict()
        if "query" not in request_json:
            return app.response_class(
                response='Query not passed!',
                status=406
            )
        result = search_obj.search_query(request_json["query"])
        for i in range(len(result)):
            result[i]["Ease_of_reading"]=random()
            result[i]["Political_bias"]=random()
            result[i]["Sentiment"]=random()
            result[i]["Objectivity"]=random()
        return app.response_class(
            response=json.dumps(result),
            status=200,
            mimetype='application/json'
        )
    except Exception as ex:
        print("Failed to search query, Error: {}".format(ex))
        # 406 Not Acceptable:
        # This response is sent when the web server, after performing server-driven content negotiation,
        # doesn't find any content that conforms to the criteria given by the user agent.
        return app.response_class(
                response='Failed to get search query content, Error: ' + ex.__str__(),
                status=406
        )


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=7777)

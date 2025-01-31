from flask import Flask
from flask_restful import Api, Resource
from flask_migrate import Migrate
from flask_cors import CORS
from resources.user_resource import UserResource
from resources.categories_resource import CategoryResource
from resources.campaigns_resource import CampaignsResource, CampaignResource
from resources.contributions_resource import ContributionResource


from models import db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

CORS(app)
migrate = Migrate(app, db)

db.init_app(app)
api = Api(app)

class health(Resource):
    def get(self):
        return f"Server is up and running"


api.add_resource(UserResource, '/users')
api.add_resource(CategoryResource, '/categories')
api.add_resource(CampaignsResource, '/campaigns')
api.add_resource(CampaignResource, '/campaigns/<int:id>')
api.add_resource(ContributionResource, '/contributions')

api.add_resource(health, '/')

if __name__ == '__main__':
    app.run(port=4000)
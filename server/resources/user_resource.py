from flask_restful import Resource, reqparse
from flask import request, jsonify
from models import db, User


class UserResource(Resource):
    def post(self):
        # Extract user details from Clerk
        data = request.get_json()

        # Ensure required fields are provided
        if not data:
            return {'error': 'No data provided'}, 400

        required_fields = ['id', 'email', 'name']
        for field in required_fields:
            if field not in data:
                return {'error': f'{field} is required'}, 400

        clerk_id = data.get('id')  # Clerk's user ID
        email = data.get('email')
        name = data.get('name')
        avatar_url = data.get('avatar_url', None)  # Optional field

        # Check if the user already exists
        existing_user = User.query.filter_by(clerk_id=clerk_id).first()
        if existing_user:
            return {'message': 'User already exists'}, 200

        # Create a new user
        new_user = User(
            clerk_id=clerk_id,
            email=email,
            name=name,
            avatar_url=avatar_url
        )

        # Add user to the database
        try:
            db.session.add(new_user)
            db.session.commit()
            return {'message': 'New user created', 'user': {
                'id': new_user.id,
                'clerk_id': new_user.clerk_id,
                'email': new_user.email,
                'name': new_user.name,
                'avatar_url': new_user.avatar_url
            }}, 201
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to create user', 'details': str(e)}, 500

class SpecificUser(Resource):
    def patch(self, clerk_id):
        # Parse the input fields
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=False, help="User's name")
        parser.add_argument('email', type=str, required=False, help="User's email")
        parser.add_argument('avatar_url', type=str, required=False, help="User's avatar URL")
        args = parser.parse_args()

        # Find the user by ID
        user = User.query.get(clerk_id)
        if not user:
            return {'message': 'User not found'}, 404

        # Update only provided fields
        if args['name']:
            user.name = args['name']
        if args['email']:
            user.email = args['email']
        if args['avatar_url']:
            user.avatar_url = args['avatar_url']

        # Save changes to the database
        db.session.commit()
        return {'message': 'User updated successfully', 'user': {
            'id': user.clerk_id,
            'name': user.name,
            'email': user.email,
            'avatar_url': user.avatar_url
        }}, 200






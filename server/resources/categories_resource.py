from flask_restful import Resource
from flask import jsonify
from models import  Category


class CategoryResource(Resource):
    def get(self):
        try:
            # Query all categories and select only name and image_url
            categories = Category.query.with_entities(Category.name, Category.image_url, Category.id).all()

            # Convert the result into a list of dictionaries
            category_list = [{"name": cat.name, "image_url": cat.image_url, "id": cat.id} for cat in categories]

            return jsonify({"categories": category_list})

        except Exception as e:
            return {"message": "An error occurred while fetching categories.", "error": str(e)}, 500

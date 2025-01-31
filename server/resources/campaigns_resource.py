from flask_restful import Resource, reqparse
from flask import jsonify, make_response
from models import db, Campaign, User, Image, Category
from datetime import datetime


class CampaignsResource(Resource):
    def get(self):
        try:
            # Fetch all campaigns
            campaigns = Campaign.query.all()

            # Serialize campaigns along with related details
            campaigns_data = []
            for campaign in campaigns:
                campaign_data = {
                    "id": campaign.id,
                    "title": campaign.title,
                    "tagline": campaign.tagline,
                    "description": campaign.description,
                    "creator": {
                        "id": campaign.creator_id,
                        "name": User.query.get(campaign.creator_id).name,  # Fetch creator's name
                        "avatar_url": User.query.get(campaign.creator_id).avatar_url
                    },
                    "category": {
                        "id": campaign.category_id,
                        "name": campaign.category.name,  # Fetch category name
                        "image_url": campaign.category.image_url
                    },
                    "goal_amount": campaign.goal_amount,
                    "current_amount": campaign.current_amount,
                    "end_date": campaign.end_date.isoformat(),
                    "supporters": campaign.supporters,
                    "status": campaign.status,
                    "images": [{"url": image.url} for image in campaign.images],  # Include campaign images
                    "contributions": [
                        {
                            "id": contribution.id,
                            "amount": contribution.amount,
                            "contributor": {
                                "id": contribution.contributor_id,
                                "name": User.query.get(contribution.contributor_id).name,
                                "avatar_url": User.query.get(contribution.contributor_id).avatar_url
                            },
                            "created_at": contribution.created_at.isoformat()
                        }
                        for contribution in campaign.contributions
                    ],
                    "rewards": [
                        {
                            "id": reward.id,
                            "title": reward.title,
                            "description": reward.description,
                            "minimum_contribution": reward.minimum_contribution,
                            "created_at": reward.created_at.isoformat()
                        }
                        for reward in campaign.rewards
                    ],
                    "created_at": campaign.created_at.isoformat()
                }
                campaigns_data.append(campaign_data)

            # Return the serialized data as JSON
            return jsonify({"campaigns": campaigns_data})

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("title", type=str, required=True, help="Title is required")
        parser.add_argument("tagline", type=str, required=True, help="Tagline is required")
        parser.add_argument("description", type=str, required=True, help="Description is required")
        parser.add_argument("creator_id", type=str, required=True, help="Creator ID is required")
        parser.add_argument("category_id", type=int, required=True, help="Category ID is required")
        parser.add_argument("goal_amount", type=float, required=True, help="Goal amount is required")
        parser.add_argument("end_date", type=str, required=True, help="End date is required in YYYY-MM-DD format")
        parser.add_argument("images", action='append', help="Images list is optional")

        args = parser.parse_args()

        try:
            # Validate date format
            try:
                end_date = datetime.strptime(args["end_date"], "%Y-%m-%d")
            except ValueError:
                return make_response(jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400)

            # Validate creator ID exists
            creator = User.query.filter_by(clerk_id=args["creator_id"]).first()
            if not creator:
                return make_response(jsonify({"error": f"Creator with ID {args['creator_id']} does not exist."}), 400)

            # Validate category ID exists
            category = Category.query.get(args["category_id"])
            if not category:
                return make_response(jsonify({"error": f"Category with ID {args['category_id']} does not exist."}), 400)

            # Create new campaign
            now = datetime.utcnow()  # Ensure created_at is in UTC
            new_campaign = Campaign(
                title=args["title"].strip(),
                tagline=args["tagline"].strip(),
                description=args["description"].strip(),
                creator_id=args["creator_id"],
                category_id=args["category_id"],
                goal_amount=args["goal_amount"],
                end_date=end_date,
                created_at=now  # Explicitly set created_at
            )

            db.session.add(new_campaign)
            db.session.flush()  # Ensure new_campaign.id is available before committing

            # Add images (if provided)
            if args["images"]:
                for img_url in args["images"]:
                    new_image = Image(url=img_url.strip(), campaign_id=new_campaign.id)
                    db.session.add(new_image)

            db.session.commit()

            return make_response(
                jsonify({
                    "message": "Campaign created successfully",
                    "campaign_id": new_campaign.id,
                    "created_at": now.isoformat(),  # Return created_at in ISO 8601 format
                    "end_date": end_date.isoformat()  # Return end_date in ISO 8601 format
                }),
                201
            )

        except IntegrityError as ie:
            db.session.rollback()
            return make_response(jsonify({"error": "Database integrity error. Check your inputs."}), 400)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"error": str(e)}), 500)


class CampaignResource(Resource):
    def get(self, id):
        try:
            # Fetch the specific campaign by ID
            campaign = Campaign.query.get(id)

            # If the campaign does not exist, return a 404 error
            if not campaign:
                return jsonify({"error": "Campaign not found"}), 404

            # Serialize the campaign along with related details
            campaign_data = {
                "id": campaign.id,
                "title": campaign.title,
                "tagline": campaign.tagline,
                "description": campaign.description,
                "creator": {
                    "id": User.query.get(campaign.creator_id).clerk_id,
                    "name": User.query.get(campaign.creator_id).name,  # Fetch creator's name
                    "avatar_url": User.query.get(campaign.creator_id).avatar_url
                },
                "category": {
                    "id": campaign.category_id,
                    "name": campaign.category.name,  # Fetch category name
                    "image_url": campaign.category.image_url
                },
                "goal_amount": campaign.goal_amount,
                "current_amount": campaign.current_amount,
                "end_date": campaign.end_date.isoformat(),
                "supporters": campaign.supporters,
                "status": campaign.status,
                "images": [{"url": image.url} for image in campaign.images],  # Include campaign images
                "contributions": [
                    {
                        "id": contribution.id,
                        "amount": contribution.amount,
                        "contributor": {
                            "id": contribution.contributor_id,
                            "name": User.query.get(contribution.contributor_id).name,
                            "avatar_url": User.query.get(contribution.contributor_id).avatar_url
                        },
                        "created_at": contribution.created_at.isoformat()
                    }
                    for contribution in campaign.contributions
                ],
                "rewards": [
                    {
                        "id": reward.id,
                        "title": reward.title,
                        "description": reward.description,
                        "minimum_contribution": reward.minimum_contribution,
                        "created_at": reward.created_at.isoformat()
                    }
                    for reward in campaign.rewards
                ],
                "created_at": campaign.created_at.isoformat()
            }

            # Return the serialized campaign data as JSON
            return jsonify({"campaign": campaign_data})

        except Exception as e:
            # Handle any errors that may occur
            return jsonify({"error": str(e)}), 500

    def delete(self, id):
        try:
            # Fetch the campaign by ID
            campaign = Campaign.query.get(id)

            # If the campaign does not exist, return a 404 error
            if not campaign:
                return make_response(jsonify({"error": "Campaign not found"}), 404)

            # Delete related images first to avoid integrity error
            Image.query.filter_by(campaign_id=id).delete()

            # Now delete the campaign
            db.session.delete(campaign)
            db.session.commit()

            # Return a success message
            return make_response(jsonify({"message": "Campaign deleted successfully"}), 200)

        except Exception as e:
            db.session.rollback()  # Rollback in case of error
            return make_response(jsonify({"error": str(e)}), 500)




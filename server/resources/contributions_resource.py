from flask_restful import Resource, reqparse
from flask import jsonify, make_response
from models import db, Contribution, Transaction, Campaign, User

class ContributionResource(Resource):
    def post(self):
        # Parse request data
        parser = reqparse.RequestParser()
        parser.add_argument("amount", type=float, required=True, help="Amount is required")
        parser.add_argument("contributor_id", type=str, required=True, help="Contributor ID is required")
        parser.add_argument("campaign_id", type=int, required=True, help="Campaign ID is required")
        parser.add_argument("payment_method", type=str, required=True, help="Payment method is required")
        parser.add_argument("status", type=str, choices=["pending", "completed", "failed"], default="pending")
        args = parser.parse_args()

        # Validate that the contributor (user) exists
        contributor = User.query.get(args["contributor_id"])
        if not contributor:
            return make_response(jsonify({"error": "Contributor not found"}), 404)

        # Validate that the campaign exists
        campaign = Campaign.query.get(args["campaign_id"])
        if not campaign:
            return make_response(jsonify({"error": "Campaign not found"}), 404)

        try:
            # Create a new contribution
            new_contribution = Contribution(
                amount=args["amount"],
                contributor_id=args["contributor_id"],
                campaign_id=args["campaign_id"]
            )
            db.session.add(new_contribution)
            db.session.flush()  # Flush to get the contribution ID before committing

            # Create a new transaction linked to the contribution
            new_transaction = Transaction(
                contribution_id=new_contribution.id,
                amount=args["amount"],
                payment_method=args["payment_method"],
                status=args["status"]
            )
            db.session.add(new_transaction)

            # Update the current amount for the campaign
            campaign.current_amount += args["amount"]

            # Check if this contributor has already contributed to the campaign
            existing_contribution = Contribution.query.filter_by(contributor_id=args["contributor_id"], campaign_id=args["campaign_id"]).first()
            if not existing_contribution:

                campaign.supporters += 1
                db.session.add(campaign)  # Ensure the updated campaign is added to the session

            # Commit both the contribution, transaction, and the updated campaign
            db.session.commit()

            return make_response(jsonify({
                "message": "Contribution and transaction successfully created, and campaign updated",
                "contribution": {
                    "id": new_contribution.id,
                    "amount": new_contribution.amount,
                    "contributor_id": new_contribution.contributor_id,
                    "campaign_id": new_contribution.campaign_id,
                    "created_at": new_contribution.created_at
                },
                "transaction": {
                    "id": new_transaction.id,
                    "contribution_id": new_transaction.contribution_id,
                    "amount": new_transaction.amount,
                    "payment_method": new_transaction.payment_method,
                    "status": new_transaction.status,
                    "created_at": new_transaction.created_at
                },
                "campaign": {
                    "id": campaign.id,
                    "title": campaign.title,
                    "current_amount": campaign.current_amount,
                    "supporters": campaign.supporters  # Return the updated supporters count
                }
            }), 201)

        except Exception as e:
            db.session.rollback()  # Rollback in case of an error
            return make_response(jsonify({"error": str(e)}), 500)



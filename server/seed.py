from models import User, Campaign, Contribution, Reward, Category, Transaction, Image, db
from app import app
from datetime import datetime, timedelta, timezone
import random

def clear_tables():
    User.query.delete()
    Campaign.query.delete()
    Contribution.query.delete()
    Reward.query.delete()
    Category.query.delete()
    Transaction.query.delete()
    Image.query.delete()

def make_users():
    # Sample users
    users = [
        User(
            clerk_id="user_2sFwbDDGXZl7sHCfLXdcvMojw7m",
            email="hotmails14107@gmail.com",
            name="Jasper",
            avatar_url="https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJzTDRCWnhTTjNUNE1ZNFZ0UmRQMGEwWmszeSJ9"
        ),
        User(
            clerk_id="clerk_user_id_2",
            email="jane@example.com",
            name="Jane Smith",
            avatar_url="https://example.com/avatar2.jpg"
        ),
        User(
            clerk_id="clerk_user_id_3",
            email="alice@example.com",
            name="Alice Johnson",
            avatar_url="https://example.com/avatar3.jpg"
        ),
    ]
    db.session.bulk_save_objects(users)
    db.session.commit()
    print(f"Created {len(users)} users.")

def make_categories():
    # Sample categories with image URLs
    categories = [
        Category(name="Technology", image_url="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60"),
        Category(name="Creative", image_url="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=60"),
        Category(name="Community", image_url="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=60"),
        Category(name="Health", image_url="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&auto=format&fit=crop&q=60"),
    ]

    db.session.bulk_save_objects(categories)
    db.session.commit()
    print(f"Created {len(categories)} categories.")

def make_campaigns():
    # Sample campaigns
    categories = Category.query.all()
    users = User.query.all()

    campaigns = [
        Campaign(
            title="Save the Rainforest",
            tagline="Help us protect 100,000 acres of rainforest",
            description="""Help us protect 100,000 acres of rainforest and preserve biodiversity for future generations. 

            Our mission is to conserve the Amazon rainforest by working directly with local communities and indigenous peoples. This campaign will help us:

            • Purchase and protect 100,000 acres of threatened rainforest
            • Establish sustainable farming practices with local communities
            • Create ranger programs to prevent illegal logging
            • Support indigenous communities in maintaining their traditional lands

            Every dollar contributed helps protect approximately 1 acre of rainforest. Join us in this crucial mission to preserve one of Earth's most vital ecosystems.""",
            creator_id=users[0].clerk_id,
            category_id=random.choice(categories).id,
            goal_amount=5000000.00,
            current_amount=2746600.00,
            end_date=datetime.now(timezone.utc) + timedelta(days=30),
            supporters=100
        ),
        Campaign(
            title="Clean Ocean Initiative",
            tagline="Help us protect 100,000 acres of rainforest.",
            description="""Help us protect 100,000 acres of rainforest and preserve biodiversity for future generations. 

            Our mission is to conserve the Amazon rainforest by working directly with local communities and indigenous peoples. This campaign will help us:

            • Purchase and protect 100,000 acres of threatened rainforest
            • Establish sustainable farming practices with local communities
            • Create ranger programs to prevent illegal logging
            • Support indigenous communities in maintaining their traditional lands

            Every dollar contributed helps protect approximately 1 acre of rainforest. Join us in this crucial mission to preserve one of Earth's most vital ecosystems.""",
            creator_id=users[1].clerk_id,
            category_id=random.choice(categories).id,
            goal_amount=3000000.00,
            current_amount=1000000.00,
            end_date=datetime.now(timezone.utc) + timedelta(days=60),
            supporters=250
        ),
        Campaign(
            title="Wildlife Protection",
            tagline="Support endangered species conservation.",
            description="""Help us protect 100,000 acres of rainforest and preserve biodiversity for future generations. 

              Our mission is to conserve the Amazon rainforest by working directly with local communities and indigenous peoples. This campaign will help us:

              • Purchase and protect 100,000 acres of threatened rainforest
              • Establish sustainable farming practices with local communities
              • Create ranger programs to prevent illegal logging
              • Support indigenous communities in maintaining their traditional lands

              Every dollar contributed helps protect approximately 1 acre of rainforest. Join us in this crucial mission to preserve one of Earth's most vital ecosystems.""",
            creator_id=users[1].clerk_id,
            category_id=random.choice(categories).id,
            goal_amount=7000000.00,
            current_amount=5947393.00,
            end_date=datetime.now(timezone.utc) + timedelta(days=60),
            supporters=3000
        ),
        Campaign(
            title="Reforestation Project",
            tagline="Plant 1 million trees worldwide",
            description="""Help us protect 100,000 acres of rainforest and preserve biodiversity for future generations. 
  
            Our mission is to conserve the Amazon rainforest by working directly with local communities and indigenous peoples. This campaign will help us:
            
            • Purchase and protect 100,000 acres of threatened rainforest
            • Establish sustainable farming practices with local communities
            • Create ranger programs to prevent illegal logging
            • Support indigenous communities in maintaining their traditional lands
            
            Every dollar contributed helps protect approximately 1 acre of rainforest. Join us in this crucial mission to preserve one of Earth's most vital ecosystems.""",
            creator_id=users[1].clerk_id,
            category_id=random.choice(categories).id,
            goal_amount=7000000.00,
            current_amount=4000000.00,
            end_date=datetime.now(timezone.utc) + timedelta(days=60),
            supporters=4765
        ),
        Campaign(
            title="Education for All",
            tagline="uild schools in developing regions",
            description="""Help us protect 100,000 acres of rainforest and preserve biodiversity for future generations. 

            Our mission is to conserve the Amazon rainforest by working directly with local communities and indigenous peoples. This campaign will help us:

            • Purchase and protect 100,000 acres of threatened rainforest
            • Establish sustainable farming practices with local communities
            • Create ranger programs to prevent illegal logging
            • Support indigenous communities in maintaining their traditional lands

            Every dollar contributed helps protect approximately 1 acre of rainforest. Join us in this crucial mission to preserve one of Earth's most vital ecosystems.""",
            creator_id=users[1].clerk_id,
            category_id=random.choice(categories).id,
            goal_amount=7000000.00,
            current_amount=4749600.00,
            end_date=datetime.now(timezone.utc) + timedelta(days=60),
            supporters=789
        ),
    ]
    db.session.bulk_save_objects(campaigns)
    db.session.commit()
    print(f"Created {len(campaigns)} campaigns.")

def make_images():
    # Sample images linked to campaigns
    campaigns = Campaign.query.all()
    images = [
        Image(
            url="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80",
            campaign_id=campaigns[0].id
        ),
        Image(
            url="https://images.unsplash.com/photo-1498855926480-d98e83099315?auto=format&fit=crop&q=80",
            campaign_id=campaigns[1].id
        ),
        Image(
            url="https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&q=80",
            campaign_id=campaigns[2].id
        ),
        Image(
            url="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80",
            campaign_id=campaigns[3].id
        ),
        Image(
            url="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80",
            campaign_id=campaigns[4].id
        )
    ]
    db.session.bulk_save_objects(images)
    db.session.commit()
    print(f"Created {len(images)} images.")

def make_rewards():
    # Sample rewards
    campaigns = Campaign.query.all()

    rewards = [
        Reward(
            title="Early Bird Special",
            description="Get early access to our product.",
            campaign_id=campaigns[0].id,
            minimum_contribution=100.00
        ),
        Reward(
            title="Exclusive Membership",
            description="Get an exclusive membership with additional perks.",
            campaign_id=campaigns[1].id,
            minimum_contribution=150.00
        ),
    ]
    db.session.bulk_save_objects(rewards)
    db.session.commit()
    print(f"Created {len(rewards)} rewards.")

def make_contributions():
    # Sample contributions
    users = User.query.all()
    campaigns = Campaign.query.all()

    contributions = [
        Contribution(
            amount=200.00,
            contributor_id=users[1].clerk_id,
            campaign_id=campaigns[0].id
        ),
        Contribution(
            amount=150.00,
            contributor_id=users[1].clerk_id,
            campaign_id=campaigns[1].id
        ),
    ]
    db.session.bulk_save_objects(contributions)
    db.session.commit()
    print(f"Created {len(contributions)} contributions.")

def make_transactions():
    # Sample transactions
    contributions = Contribution.query.all()

    transactions = [
        Transaction(
            contribution_id=contributions[0].id,
            amount=contributions[0].amount,
            payment_method="Credit Card",
            status="completed"
        ),
        Transaction(
            contribution_id=contributions[1].id,
            amount=contributions[1].amount,
            payment_method="PayPal",
            status="completed"
        ),
    ]
    db.session.bulk_save_objects(transactions)
    db.session.commit()
    print(f"Created {len(transactions)} transactions.")

def make_users_and_data():
    clear_tables()
    make_users()
    make_categories()
    make_campaigns()
    make_images()
    make_rewards()
    make_contributions()
    make_transactions()

if __name__ == '__main__':
    with app.app_context():
        make_users_and_data()

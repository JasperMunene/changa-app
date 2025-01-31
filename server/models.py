from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import MetaData

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})


db = SQLAlchemy(metadata=metadata)

# Association Table for Many-to-Many between Users and Campaigns with additional attributes
user_campaign = db.Table('user_campaign',
    db.Column('user_id', db.String(255), db.ForeignKey('users.clerk_id'), primary_key=True),
    db.Column('campaign_id', db.Integer, db.ForeignKey('campaigns.id'), primary_key=True),
    db.Column('date_joined', db.DateTime, default=db.func.current_timestamp()),
    db.Column('status', db.String(50), default='active')
)


# Users Table
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    clerk_id = db.Column(db.String(255), nullable=False, unique=True, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    name = db.Column(db.String(255), nullable=False)
    avatar_url = db.Column(db.String(255), nullable=True)

    # Relationships
    campaigns = db.relationship('Campaign', secondary=user_campaign, backref='followers', lazy='dynamic')
    contributions = db.relationship('Contribution', backref='contributor', lazy=True)

# Campaigns Table
class Campaign(db.Model, SerializerMixin):
    __tablename__ = 'campaigns'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    tagline = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    creator_id = db.Column(db.String(255), db.ForeignKey('users.clerk_id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    goal_amount = db.Column(db.Float, nullable=False)
    current_amount = db.Column(db.Float, default=0.0)
    end_date = db.Column(db.DateTime, nullable=False)
    supporters = db.Column(db.Integer, default=0, nullable=True)
    status = db.Column(db.Enum('active', 'completed', 'failed', name='status'), default='active')
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    # Relationships
    rewards = db.relationship('Reward', backref='campaign', lazy=True, cascade="all, delete-orphan")
    contributions = db.relationship('Contribution', backref='campaign', lazy=True, cascade="all, delete-orphan")
    category = db.relationship('Category', backref=db.backref('categories_campaigns', lazy=True))


# Contributions Table
class Contribution(db.Model, SerializerMixin):
    __tablename__ = 'contributions'
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    contributor_id = db.Column(db.String(255), db.ForeignKey('users.clerk_id'), nullable=False)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id', ondelete="CASCADE"), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    transactions = db.relationship("Transaction", backref="contribution", cascade="all, delete-orphan")


# Rewards Table
class Reward(db.Model, SerializerMixin):
    __tablename__ = 'rewards'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id', ondelete="CASCADE"), nullable=False)
    minimum_contribution = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())


# Categories Table
class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

# Transactions Table
class Transaction(db.Model, SerializerMixin):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    contribution_id = db.Column(db.Integer, db.ForeignKey('contributions.id', ondelete="CASCADE"), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    status = db.Column(db.Enum('pending', 'completed', 'failed', name='transaction_status'), default='pending')
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())


class Image(db.Model, SerializerMixin):
    __tablename__ = 'images'
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(255), nullable=False)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    # Relationships
    campaign = db.relationship('Campaign', backref=db.backref('images', lazy=True))

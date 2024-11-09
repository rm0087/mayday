from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import validates
from sqlalchemy import func, Index, JSON
from datetime import datetime

from config import db

class Slide(db.Model, SerializerMixin):
    __tablename__ = "slides_table"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)

    assets = db.relationship('SlideAssets', back_populates='slide')

    serialze_rules = ('-assets.slide',)

class SlideAssets(db.Model, SerializerMixin):
    __tablename__ = "assets_table"

    id = db.Column(db.Integer, primary_key=True)
    slide_id = db.Column(db.Integer, db.ForeignKey('slides_table.id'))
    slide = db.relationship('Slide', back_populates = 'assets')
    eng = db.Column(db.JSON)
    esp = db.Column(db.JSON)
    vie = db.Column(db.JSON)

    serialze_rules = ('-slide.assets',)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Validate each JSON field during initialization
        self.validate_json_structure(self.eng, 'eng')
        self.validate_json_structure(self.esp, 'esp')
        self.validate_json_structure(self.vie, 'vie')

    def validate_json_structure(self, data, field_name):
        field_names = [
            'text',
            'images',
            'videos',
            'sounds',
        ]

        if field_name not in field_names:
            raise ValueError("field_name must be: 'text', 'images', 'videos', or 'sounds'") 
        """Validates that the data has the required JSON structure."""
        if not isinstance(data, dict):
            raise ValueError(f"The '{field_name}' attribute must be a dictionary.")
        
        for key, value_type in self.required_structure.items():
            if key not in data or not isinstance(data[key], value_type):
                raise ValueError(f"The '{field_name}' attribute must contain '{key}' as a list.")

    # Use the same validation method for each field with the @validates decorator
    @validates('eng', 'esp', 'vie')
    def validate_json_columns(self, key, data):
        self.validate_json_structure(data, key)
        return data



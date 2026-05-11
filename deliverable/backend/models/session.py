import uuid
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base


class PracticeSession(Base):
    __tablename__ = "practice_sessions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    roadmap_id = Column(String, ForeignKey("roadmaps.id"), nullable=True)
    question = Column(Text)
    transcript = Column(Text)
    feedback_data = Column(Text)    # JSON-serialised feedback
    score = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

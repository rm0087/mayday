"""empty message

Revision ID: 00d60ea94437
Revises: 2fa43607b719
Create Date: 2024-09-29 22:15:47.096218

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '00d60ea94437'
down_revision = '2fa43607b719'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('inc_table', schema=None) as batch_op:
        batch_op.add_column(sa.Column('key', sa.String(), nullable=True))
        batch_op.drop_column('revenue_key')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('inc_table', schema=None) as batch_op:
        batch_op.add_column(sa.Column('revenue_key', sa.VARCHAR(), nullable=True))
        batch_op.drop_column('key')

    # ### end Alembic commands ###

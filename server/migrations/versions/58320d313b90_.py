"""empty message

Revision ID: 58320d313b90
Revises: 713c2912250e
Create Date: 2024-10-05 22:10:36.873035

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '58320d313b90'
down_revision = '713c2912250e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('inc_table', schema=None) as batch_op:
        batch_op.add_column(sa.Column('accounting_standard', sa.String(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('inc_table', schema=None) as batch_op:
        batch_op.drop_column('accounting_standard')

    # ### end Alembic commands ###

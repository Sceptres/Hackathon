from firebase_admin import auth

def get_user_data(user_id):
    user = auth.get_user(user_id)
    return user
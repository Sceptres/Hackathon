from firebase_admin import auth

def get_user_data(user_id):
    """
    Parameters
    ----------
    user_id: str
        The id of the user we want to get the data of

    Returns
    -------
    UserRecord
        Returns the UserRecord containing the users data
    """

    user = auth.get_user(user_id)
    return user
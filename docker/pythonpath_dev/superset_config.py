#---------------------------------------------------------
# Superset specific config
#---------------------------------------------------------

ROW_LIMIT = 5000
SUPERSET_WEBSERVER_PORT = 8088
# Your App secret key
SECRET_KEY = '\2\mthisismyscretkey\1\2\a\b\y\h'
SQLALCHEMY_DATABASE_URI = 'postgresql://superset:superset@host.docker.internal:1155/superset'

# Flask-WTF flag for CSRF
CSRF_ENABLED = True
# Set this API key to enable Mapbox visualizations
MAPBOX_API_KEY = ''

CACHE_DEFAULT_TIMEOUT = 600

CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/1'
TALISMAN_ENABLED = False

WTF_CSRF_ENABLED = False

FEATURE_FLAGS = {
 "ENABLE_TEMPLATE_PROCESSING": True,
 "ENABLE_REACT_CRUD_VIEWS": True,
 "EMBEDDED_SUPERSET": True ,
 "ALLOW_ADHOC_SUBQUERY" : True # Allow custom sql metrics
}

PUBLIC_ROLE_LIKE = "Gamma"
ENABLE_PROXY_FIX = True
HTTP_HEADERS = {}
ENABLE_CORS = True
CORS_OPTIONS = {
 'supports_credentials': True,
 'allow_headers': ['*'],
 'resources':['*'],
 'origins': ['*']
 }

APP_NAME = "Altered Superset"

# Specify the App icon
APP_ICON = "/static/assets/images/superset-logo-horiz.png"
APP_ICON_WIDTH = 48

FAVICONS = [{"href": "/static/assets/images/favicon.png"}]


SQLALCHEMY_ENGINE_OPTIONS = {
    "max_overflow": 15,
    "pool_pre_ping": True,
    "pool_recycle": 60 * 60,
    "pool_size": 50,
}

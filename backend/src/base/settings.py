"""
Django settings for base project.

Generated by 'django-admin startproject' using Django 3.0.1.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

import os
from datetime import timedelta
from base.custom_settings import SQL_CONFIG, EMAIL_CONFIG, BASE_CONFIG
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = BASE_CONFIG.get('secret_key')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True


ALLOWED_HOSTS = ["covidb.libtech.in","b.libtech.in","6f1bfde6.ngrok.io"]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'passwordreset',
    'corsheaders',
    'rest_framework',
    'django_filters',
    'django.contrib.staticfiles',
    'rest_framework.authtoken',
    'core',
    'user',
    'social_django',
    'baseapp',
    'location_field.apps.DefaultConfig'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

CORS_ORIGIN_WHITELIST = [
    'https://covid.libtech.in',
    'http://localhost:4200',
    'http://covid.libtech.in:8010',
    'http://covid.libtech.in:8011',
    'http://covid.libtech.in:8012',
    'https://covid.libtech.in:8012',
    'http://rb.libtech.in:8012',
    'https://rb.libtech.in:8012',
    'http://covid.libtech.in:8013',
    'http://covid.libtech.in:8016',
    'https://covid.libtech.in:8016',
    'http://b.libtech.in:9001',
    'http://b.libtech.in:8888',
    'https://49adcd5c.ngrok.io',
    'https://fadeb121.ngrok.io',
]
ROOT_URLCONF = 'base.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(os.path.dirname(BASE_DIR), 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'base.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'OPTIONS': {
            'charset' : 'utf8mb4',
            'read_default_file': SQL_CONFIG,
            },
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(os.path.dirname(BASE_DIR), 'static')
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(os.path.dirname(BASE_DIR), 'media')

# Custom Setings
#Website name
WEB_NAME = "COVID Response"

AUTH_USER_MODEL = "core.User"

#CSRF_COOKIE_SECURE = True
#Django Rest Framework settings
from restconf.main import *
# Settings for sending email via Gmail
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = EMAIL_CONFIG.get('username')
EMAIL_HOST_PASSWORD = EMAIL_CONFIG.get('password')

SIMPLE_JWT = {
        'ACCESS_TOKEN_LIFETIME': timedelta(minutes=120),
        'REFRESH_TOKEN_LIFETIME': timedelta(days=2),
}

##Settings from Frontend
FRONTEND_URL = "https://covid.libtech.in"
FRONTEND_REGCONFIRM_URL = f"{FRONTEND_URL}/regconfirm/"
FRONTEND_PWDRESETCONFIRM_URL = f"{FRONTEND_URL}/pwdresetconfirm/"
FRONTEND_REGISTER_URL = f"{FRONTEND_URL}/register/"




AUTHENTICATION_BACKENDS = (
    'social_core.backends.google.GoogleOAuth2',
    'social_core.backends.facebook.FacebookOAuth2',
    'django.contrib.auth.backends.ModelBackend',
)
for key in ['GOOGLE_OAUTH2_KEY',
            'GOOGLE_OAUTH2_SECRET',
            'FACEBOOK_KEY',
            'FACEBOOK_SECRET']:
    exec("SOCIAL_AUTH_{key} = os.environ.get('{key}', '')".format(key=key))

# We need to set at least the following scopes, to ensure that we can read
# basic profile details and email addresses.
# NB: These scopes are never actually used on the backend; things will work
# just fine if you omit these settings from the backend. However, the
# _frontend_ needs to be sure to send at least these scopes in order for the
# tokens to have enough permissions to get the user model updates / matching
# working properly.
SOCIAL_AUTH_FACEBOOK_SCOPE = ['email']
SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = ['email', 'profile']

# config per http://psa.matiasaguirre.net/docs/configuration/django.html#django-admin
SOCIAL_AUTH_ADMIN_USER_SEARCH_FIELDS = ['username', 'first_name', 'email']

# If this is not set, PSA constructs a plausible username from the first portion of the
# user email, plus some random disambiguation characters if necessary.
SOCIAL_AUTH_USERNAME_IS_FULL_EMAIL = True

# define a custom social auth pipeline.
# The key thing here is to include email association. Both FB and Google
# only return validated user emails, so email validation is safe.
#
# Don't do this if you wish to use an OAuth2 provider which doesn't
# validate email addresses, as that opens up an attack vector.
# An attacker targeting one of your users might create an account with
# the OAuth2 provider, falsely claiming your user's email address as
# their own. Without validation, that provider can't know otherwise.
# They can then gain access to your user's account by logging in via
# that OAuth2 provider.
#
# See here for more details:
# http://psa.matiasaguirre.net/docs/use_cases.html#associate-users-by-email
SOCIAL_AUTH_PIPELINE = (
    'social_core.pipeline.social_auth.social_details',
    'social_core.pipeline.social_auth.social_uid',
    'social_core.pipeline.social_auth.auth_allowed',
    'social_core.pipeline.social_auth.social_user',
    'social_core.pipeline.user.get_username',
    'social_core.pipeline.social_auth.associate_by_email',  # <- this line not included by default
    'social_core.pipeline.user.create_user',
    'social_core.pipeline.social_auth.associate_user',
    'social_core.pipeline.social_auth.load_extra_data',
    'social_core.pipeline.user.user_details',
    'user.pipeline.update_user',
)

SOCIAL_AUTH_APPSECRET_PROOF = False
SOCIAL_AUTH_FACEBOOK_PROFILE_EXTRA_PARAMS = {
      'fields': 'id, name, email, picture'
}
NOSE_ARGS = ['--nocapture',
             '--nologcapture',]

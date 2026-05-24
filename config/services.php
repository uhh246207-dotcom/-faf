<?php

return [

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'adobe' => [
        'mock' => env('ADOBE_MOCK', true),
        'client_id' => env('ADOBE_CLIENT_ID'),
        'client_secret' => env('ADOBE_CLIENT_SECRET'),
        'storage_bucket' => env('ADOBE_STORAGE_BUCKET'),
    ],

];

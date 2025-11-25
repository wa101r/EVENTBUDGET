<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Laravel CORS Configuration
    |--------------------------------------------------------------------------
    |
    | This file controls how Cross-Origin Resource Sharing (CORS) is handled.
    | You should adjust settings to allow your frontend (Nuxt) to call Laravel.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],   // อนุญาตทุก method: GET POST PUT DELETE

    'allowed_origins' => ['*'],   // อนุญาตทุก domain (เช่น http://localhost:3000)

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],   // อนุญาตทุก header

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
];

<?php

/**
 * Returns the importmap for this application.
 *
 * - "path" is a path inside the asset mapper system. Use the
 *     "debug:asset-map" command to see the full list of paths.
 *
 * - "entrypoint" (JavaScript only) set to true for any module that will
 *     be used as an "entrypoint" (and passed to the importmap() Twig function).
 *
 * The "importmap:require" command can be used to add new entries to this file.
 */

return [
    'app' => [
        'path' => 'app.js',
        'entrypoint' => true,
    ],
    'react' => [
        'url' => 'https://ga.jspm.io/npm:react@18.3.1/index.js',
    ],
    'react-dom' => [
        'url' => 'https://ga.jspm.io/npm:react-dom@18.3.1/index.js',
    ],
    'react-dom/client' => [
        'url' => 'https://ga.jspm.io/npm:react-dom@18.3.1/client.js',
    ],
    'scheduler' => [
        'url' => 'https://ga.jspm.io/npm:scheduler@0.23.2/index.js',
    ],
];
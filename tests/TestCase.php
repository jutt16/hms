<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Vite;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // In test environment, if manifest doesn't exist, skip Vite
        // This allows tests to run even if assets aren't built
        if (! file_exists(public_path('build/manifest.json'))) {
            Vite::withoutVite();
        }
    }
}

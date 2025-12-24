<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Vite;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Always mock Vite methods in tests to prevent issues
        // The Blade view always calls @viteReactRefresh and @vite directives
        // and middleware calls preloadedAssets(), so we need to mock all of them
        Vite::shouldReceive('__invoke')
            ->andReturn('');
        Vite::shouldReceive('reactRefresh')
            ->andReturn('');
        Vite::shouldReceive('preloadedAssets')
            ->andReturn([]);
    }
}

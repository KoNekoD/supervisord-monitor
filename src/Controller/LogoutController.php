<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class LogoutController
{
    public function __invoke(): JsonResponse
    {
        $response = new JsonResponse();

        $response->headers->clearCookie(
            name: 'api_token',
            path: '/api',
            domain: (string)getenv('API_HOST'),
            secure: true,
            httpOnly: true,
            sameSite: 'strict'
        );

        return $response;
    }
}

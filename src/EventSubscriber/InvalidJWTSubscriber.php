<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTInvalidEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Response;

class InvalidJWTSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            Events::JWT_INVALID => ['removeCookie', -1000],
        ];
    }

    public function removeCookie(JWTInvalidEvent $event): void
    {
        $response = new Response(status: Response::HTTP_UNAUTHORIZED);

        $response->headers->clearCookie(
            name: 'api_token',
            path: '/api',
            domain: (string)getenv('API_HOST'),
            secure: true,
            httpOnly: true,
            sameSite: 'strict'
        );

        $event->setResponse($response);
    }
}

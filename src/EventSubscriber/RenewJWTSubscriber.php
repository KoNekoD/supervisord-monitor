<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTDecodedEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Lexik\Bundle\JWTAuthenticationBundle\Security\Http\Authentication\AuthenticationSuccessHandler;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Clock\Clock;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\User\UserInterface;

final class RenewJWTSubscriber
    implements EventSubscriberInterface
{
    private bool $renewNeeded = false;

    public function __construct(
        private readonly Security $security,
        private readonly AuthenticationSuccessHandler $handler,
    ) {}

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::RESPONSE => [
                /**
                 * This has to be done after session cookie is set in
                 * @see SessionListener at -1000.
                 * @see StreamedResponseListener fires at -1024,
                 * so we might as well skip it too.
                 */
                ['renew', -1026],
            ],
            Events::JWT_DECODED => [
                ['checkRenewNeeded', -1000],
            ],
        ];
    }

    public function checkRenewNeeded(JWTDecodedEvent $event): void
    {
        if (!$event->isValid()) {
            return;
        }

        $nowTs = Clock::get()->now()->getTimestamp();

        /** @var array{iat: int, exp: int} $payload */
        $payload = $event->getPayload();

        $createdTs = $payload['iat'];
        $expireTs = $payload['exp'];

        $currentPeriod = $nowTs - $createdTs;
        $halfPeriod = ($expireTs - $createdTs) / 2;

        if ($currentPeriod > $halfPeriod) {
            $this->renewNeeded = true;
        }
    }

    public function renew(ResponseEvent $event): void
    {
        $response = $event->getResponse();

        if (
            !$this->renewNeeded ||
            $response instanceof StreamedResponse ||
            $response->getStatusCode() !== Response::HTTP_OK
        ) {
            return;
        }

        $user = $this->security->getUser();
        if (!$user instanceof UserInterface) {
            return;
        }

        $newResponse = $this->handler->handleAuthenticationSuccess($user);
        $response->headers = $newResponse->headers;
    }
}

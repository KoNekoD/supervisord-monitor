<?php

declare(strict_types=1);

namespace App\Controller;

use App\ApiResource\User;
use App\DTO\AuthByCredentialsDTO;
use App\DTO\EnvVar\AppCredentialsItem;
use Lexik\Bundle\JWTAuthenticationBundle\Security\Http\Authentication\AuthenticationSuccessHandler;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\RateLimiter\RateLimiterFactory;

#[AsController]
final readonly class LoginController
{
    /** @param array<string, AppCredentialsItem> $appCredentials */
    public function __construct(
        private AuthenticationSuccessHandler $successHandler,
        private RateLimiterFactory $authByCredentialsApiLimiter,
        #[Autowire(param: 'app_credentials')] private array $appCredentials
    ) {}

    public function __invoke(#[MapRequestPayload] AuthByCredentialsDTO $DTO, Request $request): Response
    {
        $limiter = $this->authByCredentialsApiLimiter->create($DTO->login);
        if (false === $limiter->consume()->isAccepted()) {
            return new JsonResponse(data: ['detail' => 'Too many requests'], status: Response::HTTP_TOO_MANY_REQUESTS);
        }

        $providedCredentials = sprintf('%s:%s', $DTO->login, $DTO->password);

        $found = $this->appCredentials[$providedCredentials] ?? null;

        if (null === $found) {
            return new JsonResponse(data: ['detail' => 'Invalid credentials'], status: Response::HTTP_UNAUTHORIZED);
        }

        $user = new User($found->username, $found->roles);

        return $this->successHandler->handleAuthenticationSuccess($user);
    }
}

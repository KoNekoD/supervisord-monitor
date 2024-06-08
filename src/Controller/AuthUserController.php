<?php

declare(strict_types=1);

namespace App\Controller;

use App\ApiResource\User;
use App\DTO\AuthByCredentialsDTO;
use Lexik\Bundle\JWTAuthenticationBundle\Security\Http\Authentication\AuthenticationSuccessHandler;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

#[AsController]
final readonly class AuthUserController
{
    public function __construct(
        private AuthenticationSuccessHandler $successHandler,
        #[Autowire(param: 'app_credentials')] private string $appCredentials
    ) {}

    public function __invoke(#[MapRequestPayload] AuthByCredentialsDTO $DTO, Request $request): Response
    {
        $providedCredentials = sprintf('%s:%s', $DTO->email, $DTO->password);

        if ($this->appCredentials !== $providedCredentials) {
            throw new AccessDeniedHttpException('Invalid credentials.');
        }

        return $this->successHandler->handleAuthenticationSuccess(new User($DTO->email));
    }
}
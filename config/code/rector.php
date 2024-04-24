<?php

declare(strict_types=1);

use Rector\Config\RectorConfig;
use Rector\Php81\Rector\Property\ReadOnlyPropertyRector;
use Rector\Php82\Rector\Class_\ReadOnlyClassRector;
use Rector\Privatization\Rector\Class_\FinalizeClassesWithoutChildrenRector;
use Rector\Set\ValueObject\LevelSetList;
use Rector\Set\ValueObject\SetList;
use Rector\Symfony\Set\SymfonySetList;

return static function (RectorConfig $rectorConfig): void {
    $dir = __DIR__.'/../../';
    $rectorConfig->paths([
        $dir.'/config',
        $dir.'/public',
        $dir.'/src',
        $dir.'/tests',
    ]);

    $rectorConfig->skip([

    ]);

    $rectorConfig->symfonyContainerXml(
        $dir.'/var/cache/dev/App_KernelDevDebugContainer.xml'
    );

    // register rules
    $rectorConfig->rules([
        FinalizeClassesWithoutChildrenRector::class,
        ReadOnlyPropertyRector::class,
        ReadOnlyClassRector::class,
    ]);

    // define sets of rules
    $rectorConfig->sets([
        LevelSetList::UP_TO_PHP_82,
        SymfonySetList::SYMFONY_63,
        SymfonySetList::SYMFONY_CODE_QUALITY,
        SymfonySetList::SYMFONY_CONSTRUCTOR_INJECTION,
        SetList::DEAD_CODE,
        SetList::CODE_QUALITY,
        SetList::TYPE_DECLARATION,
    ]);
};

<?php

declare(strict_types=1);

use Riverwaysoft\PhpConverter\Ast\DtoVisitor;
use Riverwaysoft\PhpConverter\Bridge\Symfony\JsonResponseTypeResolver;
use Riverwaysoft\PhpConverter\Bridge\Symfony\SymfonyControllerVisitor;
use Riverwaysoft\PhpConverter\Config\PhpConverterConfig;
use Riverwaysoft\PhpConverter\Filter\Attributes\Dto;
use Riverwaysoft\PhpConverter\Filter\Attributes\DtoEndpoint;
use Riverwaysoft\PhpConverter\Filter\PhpAttributeFilter;
use Riverwaysoft\PhpConverter\OutputGenerator\TypeScript\TypeScriptOutputGenerator;
use Riverwaysoft\PhpConverter\OutputGenerator\TypeScript\TypeScriptTypeResolver;
use Riverwaysoft\PhpConverter\OutputGenerator\UnknownTypeResolver\ClassNameTypeResolver;
use Riverwaysoft\PhpConverter\OutputGenerator\UnknownTypeResolver\DateTimeTypeResolver;
use Riverwaysoft\PhpConverter\OutputWriter\OutputProcessor\OutputFilesProcessor;
use Riverwaysoft\PhpConverter\OutputWriter\OutputProcessor\PrependTextFileProcessor;
use Riverwaysoft\PhpConverter\OutputWriter\SingleFileOutputWriter\SingleFileOutputWriter;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;

return static function (PhpConverterConfig $config): void {
    $config->addVisitor(
        visitor: new DtoVisitor(
            filter: new PhpAttributeFilter(
                attribute: Dto::class
            )
        )
    );
    $config->addVisitor(
        visitor: new SymfonyControllerVisitor(
            filter: new PhpAttributeFilter(
                attribute: DtoEndpoint::class
            ),
            requestBodyAttributeName: MapRequestPayload::class,
        )
    );

    $config->setOutputGenerator(
        generator: new TypeScriptOutputGenerator(
            outputWriter: new SingleFileOutputWriter(
                relativeName: 'generated.ts'
            ),
            typeResolver: new TypeScriptTypeResolver(
                unknownTypeResolvers: [
                    new JsonResponseTypeResolver(),
                    new DateTimeTypeResolver(),
                    new ClassNameTypeResolver(),
                ]
            ),
            outputFilesProcessor: new OutputFilesProcessor(
                outputProcessors: [
                    new PrependTextFileProcessor("import axios from \"axios\";\n\n")
                ]
            ),
        )
    );
};

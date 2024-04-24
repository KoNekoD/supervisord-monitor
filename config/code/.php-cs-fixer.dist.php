<?php

$finder = (new PhpCsFixer\Finder())
    ->in(__DIR__.'/../../')
    ->exclude('var');

return (new PhpCsFixer\Config())
    ->setRules([
//        '@PSR2' => true,
//        '@Symfony' => true,
//        'increment_style' => ['style' => 'post'],
//        'global_namespace_import' => ['import_classes' => true, 'import_constants' => false, 'import_functions' => false],
//        'use_nullable_type_declarations' => true,
'@PSR12' => true,
'nullable_type_declaration' => ['syntax' => 'question_mark'],
'nullable_type_declaration_for_default_null_value' => ['use_nullable_type_declaration' => true],
'global_namespace_import' => [
    'import_classes' => true,
    'import_constants' => false,
    'import_functions' => false,
],
'concat_space' => ['spacing' => 'one'],
'function_declaration' => [
    'closure_fn_spacing' => 'none',
    'closure_function_spacing' => 'none',
],
'class_definition' => ['single_item_single_line' => true],
    ])
    ->setFinder($finder)
    ->setCacheFile('var/.tmp/.php-cs-fixer.cache');

<?php

const PRELOAD_FILE = (
    '/var/cache/prod/App_KernelProdContainer.preload.php'
);

if (file_exists(PRELOAD_FILE)) {
    require PRELOAD_FILE;
}

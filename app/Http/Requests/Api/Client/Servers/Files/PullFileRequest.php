<?php

namespace Pterodactyl\Http\Requests\Api\Client\Servers\Files;

use Pterodactyl\Models\Permission;
use Pterodactyl\Contracts\Http\ClientPermissionsRequest;
use Pterodactyl\Http\Requests\Api\Client\ClientApiRequest;

class PullFileRequest extends ClientApiRequest implements ClientPermissionsRequest
{
    public function permission(): string
    {
        return Permission::ACTION_FILE_CREATE;
    }

    /**
     * @return string[]
     */
    public function rules(): array
    {
        return [
            'url' => 'required|string|url',
            'directory' => 'sometimes|nullable|string',
            'file_name' => 'sometimes|nullable|string',
            'foreground' => 'sometimes|nullable|boolean',
        ];
    }
}

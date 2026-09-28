<?php

namespace App\Actions\Fortify;

use App\Actions\Teams\CreateTeam;
use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    public function __construct(private CreateTeam $createTeam)
    {
        //
    }

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'username' => ['nullable', ...$this->usernameRules()],
            'password' => $this->passwordRules(),
        ])->validate();

        $username = isset($input['username']) && ! empty(trim((string) $input['username']))
            ? strtolower(trim((string) $input['username']))
            : Str::slug($input['name'] ?? 'user', '_').'_'.Str::random(4);

        return DB::transaction(function () use ($input, $username) {
            $user = User::create([
                'name' => $input['name'],
                'username' => $username,
                'email' => $input['email'],
                'password' => $input['password'],
            ]);

            $this->createTeam->handle($user, $user->name."'s Team", isPersonal: true);

            return $user;
        });
    }
}

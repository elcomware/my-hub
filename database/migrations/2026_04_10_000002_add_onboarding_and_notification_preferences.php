<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('onboarding_completed_at')->nullable()->after('current_team_id');
        });

        Schema::create('notification_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->string('channel')->default('web'); // web, push, email
            $table->string('level')->default('all');   // all, urgent, none
            $table->boolean('enabled')->default(true);
            $table->timestamps();

            $table->unique(['user_id', 'team_id', 'channel']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_preferences');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('onboarding_completed_at');
        });
    }
};

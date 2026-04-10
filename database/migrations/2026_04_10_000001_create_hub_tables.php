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
        Schema::table('teams', function (Blueprint $table) {
            $table->string('logo_path')->nullable()->after('is_personal');
            $table->string('primary_color', 7)->nullable()->after('logo_path');
            $table->string('accent_color', 7)->nullable()->after('primary_color');
            $table->text('description')->nullable()->after('accent_color');
            $table->string('status')->default('active')->after('description');
            $table->string('sector')->nullable()->after('status');
        });

        Schema::create('app_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('icon')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['team_id', 'name']);
        });

        Schema::create('team_apps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('app_categories')->nullOnDelete();
            $table->string('name');
            $table->string('url');
            $table->string('icon')->nullable();
            $table->text('description')->nullable();
            $table->json('visibility_roles')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_external')->default(true);
            $table->timestamps();
        });

        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->foreignId('author_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('body');
            $table->json('target_audiences')->nullable();
            $table->string('tag')->default('info');
            $table->boolean('is_draft')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['team_id', 'published_at']);
        });

        Schema::create('announcement_reads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('announcement_id')->constrained()->cascadeOnDelete();
            $table->timestamp('read_at')->useCurrent();

            $table->unique(['user_id', 'announcement_id']);
        });

        Schema::create('user_app_favourites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('app_id')->constrained('team_apps')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'app_id']);
        });

        Schema::create('user_app_recents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('app_id')->constrained('team_apps')->cascadeOnDelete();
            $table->timestamp('launched_at')->useCurrent();

            $table->index(['user_id', 'launched_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_app_recents');
        Schema::dropIfExists('user_app_favourites');
        Schema::dropIfExists('announcement_reads');
        Schema::dropIfExists('announcements');
        Schema::dropIfExists('team_apps');
        Schema::dropIfExists('app_categories');

        Schema::table('teams', function (Blueprint $table) {
            $table->dropColumn(['logo_path', 'primary_color', 'accent_color', 'description', 'status', 'sector']);
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->string('client_name')->nullable();
            $table->string('location')->nullable();
            $table->string('venue_name')->nullable();
            $table->string('venue_url')->nullable();
            $table->string('accommodation_name')->nullable();
            $table->string('accommodation_url')->nullable();
            $table->string('drive_link')->nullable();
            $table->integer('total_budget')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('events');
    }
};

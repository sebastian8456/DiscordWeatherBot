import { SlashCommandBuilder } from "discord.js";
import fetch from "node-fetch";

const cities = ["Atlanta", "Chicago", "Seattle"]; // TODO: incorportate into choices
var cities_dict = [];

for (var city of cities) {
    cities_dict.push({"name": city, "value": city});
}

export const data = new SlashCommandBuilder().setName(`weather`).setDescription('Replies with the weather').addStringOption(option => 
    option.setName('city')
    .setDescription('The city to find weather for.')
    .setRequired(true)
    .addChoices(cities_dict)
);

export async function execute(interaction) {
    const city = interaction.options.getString('city');
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env["weather_map_api_key"]}`);
    const body = await response.json();
    const weather = body['weather'][0]['description'];

    await interaction.reply(`The weather in ${city} is ${weather}.`);
    }
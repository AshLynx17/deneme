const afkŞema = require("../../models/afk");
module.exports = {
	conf: {
		name: "afk",
		usage: "afk [sebep]",
		category: "Global",
		description: "AFK moduna girmenizi sağlar.",
		aliases: ["afk"],
	},
	async run(client, message, args) {
		if (message.member.displayName.includes("[AFK]")) return;
		let reason = args.slice(0).join(" ");
		if (!reason) reason = "Şu an AFK'yım. En kısa sürede döneceğim!";
		const regex = /h?t?t?p?s?:?\/?\/?discord.?gg\/?[a-zA-Z0-9]+/;
		const regexSecond =
			/h?t?t?p?s?:?\/?\/?discorda?p?p?.?com\/?invites\/?[a-zA-Z0-9]+/;
		if (
			regex.test(message.content) == true ||
			regexSecond.test(message.content) == true
		)
			return;
		if (
			[
				"@everyone",
				"@here",
				message.mentions.roles.first(),
				message.mentions.members.first(),
				message.mentions.users.first(),
			].some((e) => reason.includes(e))
		)
			return;
		if (message.member.manageable)
			await message.member.setNickname(
				`[AFK] ${message.member.displayName}`,
			);
		message.react("✅");
		await afkŞema.findOneAndUpdate(
			{ userID: message.author.id },
			{ reason, date: Date.now() },
			{ upsert: true },
		);
	},
};

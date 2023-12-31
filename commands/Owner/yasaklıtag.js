const data = require("../../models/yasaklıtag.js");
const ms = require("ms");
const moment = require("moment");
let serverSettings = require("../../models/serverSettings");
require("moment-duration-format");
module.exports = {
	conf: {
		name: "yasaklıtag",
		usage: "yasaklıtag ekle [tag]",
		category: "Owner",
		description: "Belirttiğiniz tagı yasaklı taglar arasına ekler.",
		aliases: ["yasaklıtag", "yasaktag"],
	},

	async run(client, message, args) {
		let server = await serverSettings.findOne({
			guildID: message.guild.id,
		});
		if (
			!server.BotOwner.includes(message.author.id) &&
			!server.GuildOwner.includes(message.author.id)
		)
			return;
		await data.findOne({ guild: message.guild.id }, async (err, res) => {
			if (args[0] == "ekle") {
				if (!args[1])
					return client.send(
						"Yasaklıya atmak istediğin tagı belirtmelisin.",
						message.author,
						message.channel,
					);
				if (!res) {
					let arr = [];
					arr.push(args[1].toLowerCase());
					const newData = new data({
						guild: message.guild.id,
						taglar: arr,
					});
					await newData.save().catch((e) => console.log(e));
					let üyeler = message.guild.members.cache.filter((x) => {
						return x.user.username
							.toLowerCase()
							.includes(args[1].toLowerCase());
					});
					await client.send(
						"**" +
							args[1] +
							"** tagında " +
							üyeler.size +
							" kişi bulundu hepsine yasaklı tag permi veriyorum.",
						message.author,
						message.channel,
					);
					client.yasaklıtag.push(args[1].toLowerCase());
					üyeler.map((x) => {
						if (x.roles.cache.has(server.BannedTagRole)) return;
						setTimeout(() => {
							x.roles.set(
								x.roles.cache.has(server.BoosterRole)
									? (server.BoosterRole, server.BannedTagRole)
									: server.BannedTagRole,
							);
						}, 1000);
					});
				} else {
					let taglar = res.taglar;
					if (taglar.includes(args[1].toLowerCase()))
						return client.send(
							"Yasaklıya atmak istediğin tag veritabanında zaten yasaklı.",
							message.author,
							message.channel,
						);
					res.taglar.push(args[1].toLowerCase());
					await res.save().catch((e) => console.log(e));
					client.yasaklıtag.push(args[1].toLowerCase());
					let üyeler = message.guild.members.cache.filter((x) => {
						return x.user.username
							.toLowerCase()
							.includes(args[1].toLowerCase());
					});
					await client.send(
						"**" +
							args[1] +
							"** tagında " +
							üyeler.size +
							" kişi bulundu hepsine yasaklı tag permi veriyorum.",
						message.author,
						message.channel,
					);
					üyeler.map((x) => {
						if (x.roles.cache.has(server.BannedTagRole)) return;
						setTimeout(() => {
							x.roles.set(
								x.roles.cache.has(server.BoosterRole)
									? (server.BoosterRole, server.BannedTagRole)
									: server.BannedTagRole,
							);
						}, 1000);
					});
				}
			}

			if (args[0] == "liste" && !args[1]) {
				if (!res)
					return await client.send(
						"Sunucuda yasaklanmış tag bulunmamakta.",
						message.author,
						message.channel,
					);
				let num = 1;
				let arrs = res.taglar.map(
					(x) =>
						`\`${num++}.\` ${x} - (${
							client.users.cache.filter((s) =>
								s.username
									.toLowerCase()
									.includes(x.toLowerCase()),
							).size
						} üye)`,
				);
				await client.send(
					arrs.join("\n"),
					message.author,
					message.channel,
				);
			}

			if (args[0] == "üye") {
				if (!args[1])
					await client.send(
						"Üyelerini listelemek istediğin yasaklı tagı belirtmelisin.",
						message.author,
						message.channel,
					);
				if (!res)
					return await client.send(
						"Veritabanında listelenecek yasaklı tag bulunmuyor.",
						message.author,
						message.channel,
					);
				if (!res.taglar.includes(args[1].toLowerCase()))
					return await client.send(
						"**" +
							res.taglar.join(",") +
							"** tag(ları) sunucuda yasaklanmış durumdadır. Belirttiğin tag veritabanında bulunmuyor.",
						message.author,
						message.channel,
					);
				let üyeler = message.guild.members.cache
					.filter((x) => {
						return x.user.username
							.toLowerCase()
							.includes(args[1].toLowerCase());
					})
					.map((x) => "<@" + x.id + "> - (`" + x.id + "`)");
				let üyelerk = message.guild.members.cache
					.filter((x) => {
						return x.user.username
							.toLowerCase()
							.includes(args[1].toLowerCase());
					})
					.map((x) => "" + x.user.username + " - (`" + x.id + "`)");
				let text = üyeler.join("\n");
				let texto = üyelerk.join("\n");
				const MAX_CHARS = 3 + 2 + text.length + 3;
				if (MAX_CHARS > 2000) {
					message.channel.send({
						content:
							"Sunucuda çok fazla yasaklı (" +
							args[1] +
							") taga ait kişi var bu yüzden txt olarak göndermek zorundayım.",

						files: [
							{
								attachment: Buffer.from(texto),
								name: "yasakli-tagdakiler.txt",
							},
						],
					});
				} else {
					message.channel.send({ content: text });
				}
			}

			if (args[0] == "kaldır") {
				let tag = args[1].toLowerCase();
				if (!res)
					return await client.send(
						"Veritabanında kaldırılılacak yasaklı tag bulunmuyor.",
						message.author,
						message.channel,
					);
				if (!res.taglar.includes(tag))
					return await client.send(
						"Belirttiğin tag yasaklı tag listesinde bulunmuyor",
						message.author,
						message.channel,
					);
				let üyeler = message.guild.members.cache.filter((x) => {
					return x.user.username.toLowerCase().includes(tag);
				});
				await client.send(
					"**" +
						args[1] +
						"** tagında " +
						üyeler.size +
						" kişi bulundu hepsineden yasaklı tag permini alıp sistemden tagı kaldırıyorum.",
					message.author,
					message.channel,
				);
				client.kaldır(client.yasaklıtag, tag);
				client.kaldır(res.taglar, tag);
				await res.save().catch((e) => console.log(e));
				üyeler.map((x) => {
					setTimeout(() => {
						x.roles.set(server.UnregisteredRole);
					}, 1000);
				});
			}

			if (args[0] == "kontrol") {
				if (!res)
					return await client.send(
						"Veritabanında kontrol edilecek yasaklı tag bulunmuyor.",
						message.author,
						message.channel,
					);
				res.taglar.forEach((x) => {
					let üye = message.guild.members.cache
						.filter((mems) => {
							return (
								mems.user.username
									.toLowerCase()
									.includes(x.toLowerCase()) &&
								!mems.roles.cache.has(server.BannedTagRole)
							);
						})
						.map((x) => x.id);
					message.channel.send({
						content: `${x} tagı bulunup <@&${
							server.BannedTagRole
						}> rolü olmayan ${
							message.guild.members.cache.filter((mems) => {
								return (
									mems.user.username
										.toLowerCase()
										.includes(x.toLowerCase()) &&
									!mems.roles.cache.has(server.BannedTagRole)
								);
							}).size
						} kişiye rolü veriyorum.`,
					});
					for (let i = 0; i < üye.length; i++) {
						setTimeout(() => {
							message.guild.members.cache
								.get(üye[i])
								.roles.set(server.BannedTagRole);
						}, (i + 1) * 1000);
					}
				});
			}
		});
	},
};

const Discord = require("discord.js");
const { table } = require("table");
const cezalar = require("../models/cezalar.js");
const mutes = require("../models/chatmute.js");
const notlar = require("../models/notlar.js");
const Cooldowns = new Discord.Collection();
const vmutes = require("../models/voicemute.js");
let serverSettings = require("../models/serverSettings");
const cezalar2 = require("../models/cezalı.js");
const isimler = require("../models/isimler.js");
const moment = require("moment");

module.exports = async (interaction) => {
	let server = await serverSettings.findOne({});

	if (interaction.customId === "memberJoinedServer") {
		let ButtonCooldowns = Cooldowns.get(interaction.customId);

		if (!ButtonCooldowns) {
			ButtonCooldowns = new Discord.Collection();
			Cooldowns.set(interaction.customId, ButtonCooldowns);
		}
		const userCooldown = ButtonCooldowns.get(interaction.user.id);
		const now = Date.now();
		if (userCooldown) {
			if (now - userCooldown < 100_000)
				return interaction.reply({
					content: `Butonlarla hızlı işlem yaptığınız için yavaşlatıldınız! Bir zaman sonra tekrar deneyin.`,
					ephemeral: true,
				});
			else ButtonCooldowns.set(interaction.user.id, now);
		} else ButtonCooldowns.set(interaction.user.id, now);
		interaction.reply({
			content: `${moment(interaction.member.joinedAt).format("LLL")}`,
			ephemeral: true,
		});
	} else if (interaction.customId === "historyName") {
		let ButtonCooldowns = Cooldowns.get(interaction.customId);

		if (!ButtonCooldowns) {
			ButtonCooldowns = new Discord.Collection();
			Cooldowns.set(interaction.customId, ButtonCooldowns);
		}
		const userCooldown = ButtonCooldowns.get(interaction.user.id);
		const now = Date.now();
		if (userCooldown) {
			if (now - userCooldown < 100_000)
				return interaction.reply({
					content: `Butonlarla hızlı işlem yaptığınız için yavaşlatıldınız! Bir zaman sonra tekrar deneyin.`,
					ephemeral: true,
				});
			else ButtonCooldowns.set(interaction.user.id, now);
		} else ButtonCooldowns.set(interaction.user.id, now);
		isimler.findOne({ user: interaction.user.id }, async (err, res) => {
			if (!res)
				return interaction.reply({
					content: "Geçmiş isimleriniz bulunamadı.",
					ephemeral: true,
				});
			const zaa = new Discord.EmbedBuilder()
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.displayAvatarURL({
						dynamic: true,
					}),
				})
				.setDescription(
					`
Toplam da ${res.isimler.length} isim kayıtınız bulundu:
	
${res.isimler.map((x) => `\`• ${x.isim}\` (${x.state})`).join("\n")}`,
				)
				.setColor("Random");
			interaction.reply({ embeds: [zaa], ephemeral: true });
		});
	} else if (interaction.customId === "activePenalties") {
		let ButtonCooldowns = Cooldowns.get(interaction.customId);

		if (!ButtonCooldowns) {
			ButtonCooldowns = new Discord.Collection();
			Cooldowns.set(interaction.customId, ButtonCooldowns);
		}
		const userCooldown = ButtonCooldowns.get(interaction.user.id);
		const now = Date.now();
		if (userCooldown) {
			if (now - userCooldown < 100_000)
				return interaction.reply({
					content: `Butonlarla hızlı işlem yaptığınız için yavaşlatıldınız! Bir zaman sonra tekrar deneyin.`,
					ephemeral: true,
				});
			else ButtonCooldowns.set(interaction.user.id, now);
		} else ButtonCooldowns.set(interaction.user.id, now);

		let mute = "";
		let vmute = "";
		let cezalı = "";
		await cezalar2.findOne(
			{ user: interaction.user.id },
			async (err, doc) => {
				if (!doc) {
					cezalı = "Veritabanında cezalı bilgisi bulunmamakta.";
				} else {
					if (doc.ceza == false) {
						cezalı = "Veritabanında cezalı bilgisi bulunmamakta.";
					} else if (doc.ceza == true) {
						cezalı =
							"Cezalı Atan Yetkili: <@" +
							client.users.cache.get(doc.yetkili) +
							">\nCeza Sebebi: `" +
							doc.sebep +
							"`\nCeza Tarihi: `" +
							doc.tarih +
							"`\nCeza Bitiş: `" +
							moment(doc.bitis).format("LLL") +
							"`";
					}
				}
			},
		);
		await mutes.findOne({ user: interaction.user.id }, async (err, doc) => {
			if (!doc) {
				mute = "Veritabanında chat mute bilgisi bulunmamakta.";
			} else {
				if (doc.muted == false) {
					mute = "Veritabanında chat mute bilgisi bulunmamakta.";
				} else if (doc.muted == true) {
					mute =
						"Mute Atan Yetkili: <@" +
						client.users.cache.get(doc.yetkili) +
						">\nMute Sebebi: `" +
						doc.sebep +
						"`\nMute Başlangıç: `" +
						moment(doc.start).format("LLL") +
						"`\nMute Bitiş: `" +
						moment(doc.endDate).format("LLL") +
						"`";
				}
			}
		});
		await vmutes.findOne(
			{ user: interaction.user.id },
			async (err, doc) => {
				if (!doc) {
					vmute = "Veritabanında ses mute bilgisi bulunmamakta.";
				} else {
					if (doc.muted == false) {
						vmute = "Veritabanında ses mute bilgisi bulunmamakta.";
					} else if (doc.muted == true) {
						vmute =
							"Mute Atan Yetkili: <@" +
							client.users.cache.get(doc.yetkili) +
							">\nMute Sebebi: `" +
							doc.sebep +
							"`\nMute Başlangıç: `" +
							moment(doc.start).format("LLL") +
							"`\nMute Bitiş: `" +
							moment(doc.endDate).format("LLL") +
							"`";
					}
				}
			},
		);
		interaction.reply({
			content: `
Ceza bilgileriniz aşağıda belirtilmiştir.

\` • \` Cezalı Bilgisi;
${cezalı || "Veritabanında aktif cezalı bilgisi bulunmamakta."}

\` • \` Chat Mute Bilgisi;
${mute || "Veritabanında aktif chat mute bilgisi bulunmamakta."}

\` • \` Voice Mute Bilgisi;
${vmute || "Veritabanında aktif voice mute bilgisi bulunmamakta."}

`,
			ephemeral: true,
		});
	} else if (interaction.customId === "penaltyPoints") {
		let ButtonCooldowns = Cooldowns.get(interaction.customId);

		if (!ButtonCooldowns) {
			ButtonCooldowns = new Discord.Collection();
			Cooldowns.set(interaction.customId, ButtonCooldowns);
		}
		const userCooldown = ButtonCooldowns.get(interaction.user.id);
		const now = Date.now();
		if (userCooldown) {
			if (now - userCooldown < 100_000)
				return interaction.reply({
					content: `Butonlarla hızlı işlem yaptığınız için yavaşlatıldınız! Bir zaman sonra tekrar deneyin.`,
					ephemeral: true,
				});
			else ButtonCooldowns.set(interaction.user.id, now);
		} else ButtonCooldowns.set(interaction.user.id, now);
		let puan = await client.punishPoint(interaction.user.id);
		interaction.reply({
			content: `${interaction.user}: ` + puan + ` ceza puanı`,
			ephemeral: true,
		});
	} else if (interaction.customId === "historyPenalties") {
		let ButtonCooldowns = Cooldowns.get(interaction.customId);

		if (!ButtonCooldowns) {
			ButtonCooldowns = new Discord.Collection();
			Cooldowns.set(interaction.customId, ButtonCooldowns);
		}
		const userCooldown = ButtonCooldowns.get(interaction.user.id);
		const now = Date.now();
		if (userCooldown) {
			if (now - userCooldown < 100_000)
				return interaction.reply({
					content: `Butonlarla hızlı işlem yaptığınız için yavaşlatıldınız! Bir zaman sonra tekrar deneyin.`,
					ephemeral: true,
				});
			else ButtonCooldowns.set(interaction.user.id, now);
		} else ButtonCooldowns.set(interaction.user.id, now);
		await cezalar
			.find({ user: interaction.user.id })
			.sort({ ihlal: "descending" })
			.exec(async (err, res) => {
				let datax = [["ID", "Tarih", "Ceza", "Sebep"]];

				let dataxe = [
					["ID", "Ceza", "Tarih", "Bitiş", "Yetkili", "Sebep"],
				];

				let config = {
					border: {
						topBody: ``,
						topJoin: ``,
						topLeft: ``,
						topRight: ``,

						bottomBody: ``,
						bottomJoin: ``,
						bottomLeft: ``,
						bottomRight: ``,

						bodyLeft: `│`,
						bodyRight: `│`,
						bodyJoin: `│`,

						joinBody: ``,
						joinLeft: ``,
						joinRight: ``,
						joinJoin: ``,
					},
				};
				res.map((x) => {
					datax.push([x.ihlal, x.tarih, x.ceza, x.sebep]);
				});
				let cezaSayi = datax.length - 1;
				if (cezaSayi == 0)
					return interaction.reply({
						content: `Ceza bilginiz bulunamadı.
						`,
						ephemeral: true,
					});

				res.map((x) => {
					dataxe.push([
						x.ihlal,
						x.ceza,
						x.tarih,
						x.bitiş,
						client.users.cache.get(x.yetkili).username,
						x.sebep,
					]);
				});

				let outi = table(datax.slice(0, 15), config);
				interaction.reply({
					content:
						"<@" +
						interaction.user.id +
						"> toplam " +
						cezaSayi +
						" cezanız bulunmakta son 15 ceza aşağıda belirtilmiştir. ```fix\n" +
						outi +
						"\n``` ",
					ephemeral: true,
				});
			});
	} else if (interaction.customId === "notes") {
		let ButtonCooldowns = Cooldowns.get(interaction.customId);

		if (!ButtonCooldowns) {
			ButtonCooldowns = new Discord.Collection();
			Cooldowns.set(interaction.customId, ButtonCooldowns);
		}
		const userCooldown = ButtonCooldowns.get(interaction.user.id);
		const now = Date.now();
		if (userCooldown) {
			if (now - userCooldown < 100_000)
				return interaction.reply({
					content: `Butonlarla hızlı işlem yaptığınız için yavaşlatıldınız! Bir zaman sonra tekrar deneyin.`,
					ephemeral: true,
				});
			else ButtonCooldowns.set(interaction.user.id, now);
		} else ButtonCooldowns.set(interaction.user.id, now);
		await notlar.findOne(
			{ user: interaction.user.id },
			async (err, res) => {
				if (!res)
					return interaction.reply({
						content: "Sistemde kayıtlı notunuz bulunmamaktadır.",
						ephemeral: true,
					});
				const notes = new Discord.EmbedBuilder()
					.setAuthor({
						name: interaction.user.username,
						iconURL: interaction.user.displayAvatarURL({
							dynamic: true,
						}),
					})
					.setDescription(
						`🚫 <@${
							interaction.user.id
						}> ceza notlarınız aşağıda belirtilmiştir.\n\n${res.notlar
							.map(
								(x) =>
									`- Not Bırakan <@${x.yetkili}> | (\`${x.yetkili}\`)\n- Not: \`${x.not}\``,
							)
							.join("\n\n")}`,
						{ split: true },
					)
					.setColor("Random");
				let notlarıms = res.notlar.map(
					(x) =>
						`• Not Bırakan Yetkili: <@${x.yetkili}> | (\`${x.yetkili}\`)\n• Not: \`${x.not}\``,
				);
				const MAX_CHARS = 3 + 2 + notlar.length + 3;
				if (MAX_CHARS < 2000) {
					const cann = new Discord.EmbedBuilder()
						.setAuthor({
							name: interaction.user.username,
							iconURL: interaction.user.displayAvatarURL({
								dynamic: true,
							}),
						})
						.setDescription(
							`🚫 <@${
								interaction.user.id
							}> ceza notlarınız çok fazla olduğundan dolayı son 10 not aşağıda belirtilmiştir.\n\n${notlarıms
								.reverse()
								.join("\n\n")}`,
						)
						.setColor("Random");
					interaction.reply({ embeds: [cann], ephemeral: true });
				} else {
					interaction.reply({ embeds: [notes], ephemeral: true });
				}
			},
		);
	} else if (interaction.customId === "penaltiesNumber") {
		let ButtonCooldowns = Cooldowns.get(interaction.customId);

		if (!ButtonCooldowns) {
			ButtonCooldowns = new Discord.Collection();
			Cooldowns.set(interaction.customId, ButtonCooldowns);
		}
		const userCooldown = ButtonCooldowns.get(interaction.user.id);
		const now = Date.now();
		if (userCooldown) {
			if (now - userCooldown < 100_000)
				return interaction.reply({
					content: `Butonlarla hızlı işlem yaptığınız için yavaşlatıldınız! Bir zaman sonra tekrar deneyin.`,
					ephemeral: true,
				});
			else ButtonCooldowns.set(interaction.user.id, now);
		} else ButtonCooldowns.set(interaction.user.id, now);

		await cezalar
			.find({ user: interaction.user.id })
			.sort({ ihlal: "descending" })
			.exec(async (err, res) => {
				let filterArr = [];
				res.map((x) => filterArr.push(x.ceza));
				let chatMute =
					filterArr.filter((x) => x == "Chat Mute").length || 0;
				let voiceMute =
					filterArr.filter((x) => x == "Voice Mute").length || 0;
				let jail = filterArr.filter((x) => x == "Cezalı").length || 0;
				let puan = await client.punishPoint(interaction.user.id);
				let cezasayı = await client.cezasayı(interaction.user.id);
				let warn = filterArr.filter((x) => x == "Uyarı").length || 0;

				const embed = new Discord.EmbedBuilder().setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.displayAvatarURL({
						dynamic: true,
					}),
				}).setDescription(`Ceza sayılarınız aşağıda belirtilmiştir.
					
${chatMute} Chat Mute, ${voiceMute} Voice Mute, ${jail} Cezalı ve ${warn} Uyarı.

_Ceza Puanı_ : **${puan}**`);

				interaction.reply({ embeds: [embed], ephemeral: true });
			});
	} else if (interaction.customId === "memberRoles") {
		let ButtonCooldowns = Cooldowns.get(interaction.customId);

		if (!ButtonCooldowns) {
			ButtonCooldowns = new Discord.Collection();
			Cooldowns.set(interaction.customId, ButtonCooldowns);
		}
		const userCooldown = ButtonCooldowns.get(interaction.user.id);
		const now = Date.now();
		if (userCooldown) {
			if (now - userCooldown < 100_000)
				return interaction.reply({
					content: `Butonlarla hızlı işlem yaptığınız için yavaşlatıldınız! Bir zaman sonra tekrar deneyin.`,
					ephemeral: true,
				});
			else ButtonCooldowns.set(interaction.user.id, now);
		} else ButtonCooldowns.set(interaction.user.id, now);
		const roles = interaction.member.roles.cache
			.filter((role) => role.id !== interaction.guild.id)
			.sort((a, b) => b.position - a.position)
			.map((role) => `<@&${role.id}>`);
		const rolleri = [];
		if (roles.length > 50) {
			const lent = roles.length - 50;
			let itemler = roles.slice(0, 50);
			itemler.map((x) => rolleri.push(x));
			rolleri.push(`${lent} daha...`);
		} else {
			roles.map((x) => rolleri.push(x));
		}

		const embed = new Discord.EmbedBuilder()
			.setColor("Random")
			.setDescription(
				"Üzerinizdeki roller aşağıda belirtilmiştir. (" +
					roles.length +
					" tane): " +
					"\n " +
					rolleri.join(", ") +
					" ",
			);
		await interaction.reply({ embeds: [embed], ephemeral: true });
	} else if (interaction.customId === "createdAt") {
		let ButtonCooldowns = Cooldowns.get(interaction.customId);

		if (!ButtonCooldowns) {
			ButtonCooldowns = new Discord.Collection();
			Cooldowns.set(interaction.customId, ButtonCooldowns);
		}
		const userCooldown = ButtonCooldowns.get(interaction.user.id);
		const now = Date.now();
		if (userCooldown) {
			if (now - userCooldown < 100_000)
				return interaction.reply({
					content: `Butonlarla hızlı işlem yaptığınız için yavaşlatıldınız! Bir zaman sonra tekrar deneyin.`,
					ephemeral: true,
				});
			else ButtonCooldowns.set(interaction.user.id, now);
		} else ButtonCooldowns.set(interaction.user.id, now);
		await interaction.reply({
			content:
				"Hesap oluşturulma tarihiniz: " +
				moment(interaction.user.createdTimestamp).format("LLL") +
				"",
			ephemeral: true,
		});
	}
};

module.exports.conf = {
	name: "interactionCreate",
};

// place files you want to import through the `$lib` alias in this folder.
import { programa } from './programa';

export class Prolog {
	static program = programa;

	constructor() {}

	nuevaSesion() {
		this.session = window.pl.create();
	}

	async esperarRespuesta() {
		const consulta = await this.consultar('regla(Respuesta).');
		const respuestaString = consulta[0].match(/\[(.*?)\]/)[1];
		const respuestasArr = respuestaString.split(',');

		return respuestasArr;
	}

	async enviarRespuesta(respuesta) {
		await this.consultar(`regla('${respuesta}').`);

		const consulta = await this.consultar('regla(Respuesta).');
		const respuestaString = consulta[0].match(/\[(.*?)\]/)[1];
		const respuestasArr = respuestaString.split(',');

		return respuestasArr;
	}

	consultar(regla) {
		return new Promise((resolve, reject) => {
			const session = this.session;
			const consultRule = regla || this._regla_para_consultar;
			let resultados = [];
			let terminado = false;

			// Intentamos cargar el programa Prolog
			session.consult(Prolog.program, {
				success: () => {
					session.query(consultRule, {
						success: () => {
							session.answers(
								(x) => {
									let respuesta = session.format_answer(x);
									if (respuesta) {
										resultados.push(respuesta);
									}
								},
								{
									success: () => {
										terminado = true;
										resolve(resultados);
									},
									error: (err) => {
										terminado = true;
										reject(err);
									}
								}
							);
						},
						error: (err) => {
							terminado = true;
							reject(err);
						}
					});

					// Timeout para asegurar que siempre se devuelva algo
					setTimeout(() => {
						if (!terminado) {
							resolve(resultados);
						}
					}, 1000);
				},
				error: (err) => {
					reject(err);
				}
			});
		});
	}
}

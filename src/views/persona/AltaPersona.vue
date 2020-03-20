<template>
  <div class="animated fadeIn">
    <b-card header="Datos Generales" header-tag="header" footer-tag="footer">
      <div>
        <b-form>
          <div>
            <b-card bg-variant="light">
              <b-row>
                <b-col class="pad-x">
                  <b-form-group>
                    <b-row>Nombre:</b-row>
                    <b-row>
                      <b-form-input id="nombre" v-model="personaDto.perNombre"></b-form-input>
                    </b-row>
                  </b-form-group>
                </b-col>
                <b-col class="pad-x">
                  <b-form-group>
                    <b-row>Apellido:</b-row>
                    <b-row>
                      <b-form-input id="apellido" v-model="personaDto.perApellido"></b-form-input>
                    </b-row>
                  </b-form-group>
                </b-col>
                <b-col class="pad-x">
                  <b-form-group>

                  </b-form-group>
                </b-col>
              </b-row>

              <b-form-group>
                <b-row>
                  <b-col class="pad-x">
                    <b-form-group>
                      <b-row>Tipo de Documento:</b-row>
                      <b-row>
                        <b-form-select id="comboTipoDocumento" v-model="personaDto.perTpoId" 
                                       :options="tipoDocumentoOptions">
                          <template slot="first">
                            <option :value="null" disabled>-- Seleccionar una opcion --</option>
                          </template>
                        </b-form-select>
                      </b-row>
                    </b-form-group>
                  </b-col>
                  <b-col class="pad-x">
                    <b-form-group>
                      <b-row>Numero Documento:</b-row>
                      <b-row>
                        <b-form-input type="number" id="numeroDocumento" min="10000"
                                      v-model="personaDto.perNumeroDocumento"></b-form-input>
                      </b-row>
                    </b-form-group>
                  </b-col>
                  <b-col class="pad-x">
                    <b-form-group>
                      <b-row>Fecha Nacimiento:</b-row>
                      <b-row>
                        <datepicker id="fechaNacimiento" v-model="personaDto.perFechaNacimiento" format="dd/MM/yyyy"
                                    bootstrap-styling input-class="fechas"></datepicker>
                      </b-row>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-form-group>
            </b-card>
          </div>
        </b-form>
      </div>
      <hr/>
      <div>
        <router-link to="/personas">
          <b-button pill class="m-1" variant="dark">
            <v-icon name="arrow-left"></v-icon>
            Volver
          </b-button>
        </router-link>
        <b-button pill class="m-1" variant="success" @click="savePersona()">
          <v-icon name="save"></v-icon>
          Guardar
        </b-button>
      </div>
    </b-card>
  </div>
</template>

<script>
	import axios from 'axios'; //httpClient

	export default {
		name: 'alta-persona', // nombre componente
    props: { // variables que pueden entrar por un "padre"
      id: String,
    },

    created() { // constructor
      if(this.id) {
        this.esAlta = false;
      }
    },
		mounted() { // onInit
      this.getTiposDocumento();
      if (!this.esAlta) {
        this.getPersona(this.id)
      }
		},
		data() { // variables del componente
      return { // SIEMPRE
        esAlta: true,
				tipoDocumentoOptions: {},
				personaDto: {
					perApellido: null,
					perFechaNacimiento: null,
					perId: null,
					perNombre: null,
					perNumeroDocumento: null,
					perTpoId: null
				}
			};
		},
		methods: {
			getTiposDocumento() {
				axios.get('http://localhost:8080/documentos').then(respuesta => {
					this.tipoDocumentoOptions = respuesta.data.data;
					this.tipoDocumentoOptions.forEach(element => {
						element.value = element.tpoId;
						element.text = element.tpoDescripcion;
					});
				});
			},
			savePersona() {
				const mensaje = this.validar();
				if (mensaje === 'Debe ingresar:') {
          if(this.esAlta) {
            axios
              .post('http://localhost:8080/personas', this.personaDto)
              .then(respuesta => {
                this.makeToast(
                  'success',
                  'Registro realizado!',
                  'Se ha agregado correctamente',
                  true
                );
              })
              .catch(error => {
                this.makeToast('danger', 'Ups!', 'Ha ocurrido un error', false);
              });

          } else {
            this.updatePersona()
          }
				} else {
					this.makeToast('warning', 'Ups!', mensaje, false);
				}
			},
      	getPersona(id) {
				axios
					.get('http://localhost:8080/personas/' + this.id)
					.then(respuesta => {
						this.personaDto = respuesta.data.data;
					});
			},
			updatePersona() {
				const router = this.$router;
				axios
					.put('http://localhost:8080/personas', this.personaDto)
					.then(respuesta => {

						if (respuesta.data.status === 0) {
							router.push('/personas');
						}
					})
					.catch(error => {
					});
			},
			validar() {
				let mensaje = 'Debe ingresar:';
        if (this.personaDto.perNombre === null || this.personaDto.perNombre === '' ) {
            mensaje += ' nombre,'
        }
        if(this.personaDto.perApellido === null || this.personaDto.perApellido === '') {
          mensaje += ' apellido,';
        }
				if (this.personaDto.perTpoId === null) {
					mensaje += ' tipo de documento,';
        }
        if (this.personaDto.perNumeroDocumento == null || this.personaDto.perNumeroDocumento === '') {
          mensaje += ' numero de documento,';  
        }
        if (this.personaDto.perFechaNacimiento === null) {
          	mensaje += ' fecha de nacimiento.';
        }
				return mensaje;
			},
			makeToast(variant = null, titulo, msj, redirect) {
				const router = this.$router;
				setTimeout(resolve => {
					this.$bvToast.toast(`${msj}`, {
						title: `${titulo}`,
						variant: variant,
						solid: true
					});
				}, 1000);
				if (redirect) router.push('/personas');
      }
      
    }
	};
</script>

<style lang="scss">
  .pad-x {
    padding-left: 2%;
    padding-right: 2%;
  }

  .fechas {
    background-color: white !important;
  }
</style>

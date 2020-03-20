<template>
  <div class="animated fadeIn">
    <b-card header="Personas" header-tag="header" footer-tag="footer">
         <b-card bg-variant="light">
              <b-row>
                <b-col class="pad-x">
                  <b-form-group>
                    <b-row>Nombre:</b-row>
                    <b-row>
                      <b-form-input id="nombre" v-model="nombreFiltro"></b-form-input>
                    </b-row>
                  </b-form-group>
                </b-col>
                <b-col class="pad-x">
                  <b-form-group>
                      <b-row>Tipo de Documento:</b-row>
                      <b-row>
                        <b-form-select id="comboTipoDocumento" v-model="tipoDocumentoFiltro" :options="tipoDocumentoOptions">
                          <template slot="first">
                            <option :value="null">-- Seleccionar una opcion --</option>
                          </template>
                        </b-form-select>
                      </b-row>
                    </b-form-group>
                </b-col>
                <b-col class="pad-x">
                  <b-form-group>

                  </b-form-group>
                </b-col>
                
              </b-row>
              <hr/>
      <div class="button-container">
          <b-button pill class="m-1" variant="outline-dark" @click="filtrarPersonas()">
            Filtrar
          </b-button>
      </div>
            </b-card>
      <router-link to="/alta-persona">
        <b-button pill variant="outline-success"><v-icon name="plus"/> Nueva</b-button>
      </router-link>
      <br />
      <br />
      <div v-if="items != null">
        <b-table :small="true" responsive striped hover :items="personasFiltradas" :fields="fields">
          <template slot="actions" slot-scope="row">
            <b-button size="sm" pill class="mr-2" variant="success" @click="editPersona(row.item)"><v-icon name="edit"/></b-button>
            <b-button size="sm" pill variant="dark" @click="showDeleteMsg(row.item, row.index)" class="mr-2"><v-icon name="trash-alt"/></b-button>
          </template>
        </b-table>
      </div>
      <span v-else>Cargando Personas...</span>
    </b-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "personas",
  mounted() {
    this.getPersonas();
    this.getTiposDocumento();
  },
  data() {
    return {
      tipoDocumentoOptions: {},
      tipoDocumentoFiltro: null,
      nombreFiltro: null,
      items: null,
      personasFiltradas: null,
      fields: {
        perId: {
          label: "Id",
          sortable: true
        },
        perNombre: {
          label: "Nombre",
          sortable: true
        },
        perApellido: {
          label: "Apellido",
          sortable: true
        },
        perNumeroDocumento: {
          label: "Nro Documento",
          sortable: false
        },
        perTipoDocumento: {
          label: "Tipo Documento",
          sortable: false
        },
				fechaNacimientoFormat: {
          label: "Fecha Nacimiento",
          sortable: false
        },
        actions: {
          label: "",
          sortable: false
        }
      }
    };
  },
  methods: {
    getPersonas() {
      axios.get("http://localhost:8080/personas").then(respuesta => {
        this.items = respuesta.data.data;
        this.items.forEach(element => {
          element.perTipoDocumento = element.perTipoDocumento.tpoDescripcion;
        });
        this.personasFiltradas = this.items;
      });
    },
    filtros() {
      let filtros = {}
      if (this.nombreFiltro) filtros.nombrePersona = this.nombreFiltro.toLowerCase()
      if (this.tipoDocumentoFiltro) filtros.dniPersona = this.tipoDocumentoFiltro
      return filtros
    },
    filtrarPersonas () {
     let filtros = this.filtros()
     console.log(filtros)
     if (Object.keys(filtros).length != 0) {
        this.personasFiltradas = this.items.filter( item => {
            if (filtros.nombrePersona) {
                return item.perNombre.toLowerCase().includes(this.nombreFiltro.toLowerCase())
            }
            if (filtros.dniPersona) {
                return item.perTipoDocumento == this.tipoDocumentoFiltro
            }
            return item.perNombre.toLowerCase().includes(this.nombreFiltro.toLowerCase()) && i.perTipoDocumento == this.tipoDocumentoFiltro;
        })
    } else  {
      this.personasFiltradas = this.items
    }
    },
    // filtrarPersonas() {
    //   if (this.nombreFiltro || this.tipoDocumentoFiltro) {
    //       if (this.nombreFiltro) {
    //           this.personasFiltradas = this.items.filter(i => i.perNombre.toLowerCase().includes(this.nombreFiltro.toLowerCase()));
    //      }
    //      if (this.tipoDocumentoFiltro) {
    //        this.personasFiltradas = this.items.filter(i => i.perTipoDocumento == this.tipoDocumentoFiltro)
    //      }
    //      if (this.nombreFiltro && this.tipoDocumentoFiltro) {
    //           this.personasFiltradas = this.items.filter(i => i.perNombre.toLowerCase().includes(this.nombreFiltro.toLowerCase()) && i.perTipoDocumento == this.tipoDocumentoFiltro);
    //      }
    //   } else {
    //     this.personasFiltradas = this.items
    //   }
    
    // },
    	getTiposDocumento() {
				axios.get('http://localhost:8080/documentos').then(respuesta => {
					this.tipoDocumentoOptions = respuesta.data.data;
					this.tipoDocumentoOptions.forEach(element => {
						element.value = element.tpoDescripcion;
						element.text = element.tpoDescripcion;
					});
				});
			},
    editPersona(item){
    	this.$router.push({path: 'editar-persona/' + item.perId});
    },
		deletePersona(item, index){
			axios.delete("http://localhost:8080/personas/" + item.perId).then(respuesta => {
        this.getPersonas();
			});
    },
     showDeleteMsg(item, index) {
       const persona = item.perNombre + ' ' + item.perApellido
        this.$bvModal.msgBoxConfirm('¿Está seguro que quiere eliminar a: ' + persona + '?', {
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'success',
          cancelVariant: 'dark',
          headerClass: 'p-2 border-bottom-0',
          footerClass: 'p-2 border-top-0',
          okTitle: 'SI',
          cancelTitle: 'NO',
          centered: true
        })
          .then(value => {
            if (value) {
              this.deletePersona(item, index)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
  }
};
</script>

<style lang="scss">
  .pad-x {
    padding-left: 2%;
    padding-right: 2%;
  }
  .button-container {
    text-align-last: end;
  }
</style>
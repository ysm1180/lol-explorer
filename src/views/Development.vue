<template>
  <div v-if="lcuData">
    <div>
      {{
        `${lcuData.protocol}://${lcuData.username}:${lcuData.password}@${
          lcuData.address
        }:${lcuData.port}`
      }}
    </div>
    <div id="swagger-ui"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';
import Swagger from 'swagger-client';

@Component
export default class Development extends Vue {
  private swagger: boolean = false;

  public get lcuData() {
    return this.$store.state.connection.lcuData;
  }

  public mounted() {
    const lcuData = this.lcuData;
    axios
      .get(
        `${lcuData.protocol}://${lcuData.username}:${lcuData.password}@${
          lcuData.address
        }:${lcuData.port}/swagger/v2/swagger.json`
      )
      .then(() => {
        this.swagger = true;
        Swagger(
          `${lcuData.protocol}://${
            lcuData.address
          }:${lcuData.port}/swagger/v2/swagger.json`,
          {
            authorizations: {
              // Type of auth, is inferred from the specification provided
              my_basic_auth: {
                username: lcuData.username,
                password: lcuData.password,
              },
            },
          }
        )
          .then((client: any) => {
            console.log(client);
          })
          .catch((err: any) => console.log(err));
      })
      .catch((err) => {
        this.swagger = false;
      });
  }
}
</script>

<style lang="scss" scoped></style>

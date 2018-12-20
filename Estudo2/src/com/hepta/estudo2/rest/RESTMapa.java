import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.hepta.estudo2.entity.Mercado;
import com.hepta.estudo2.persistence.MercadoDAO;

@Path("/market")
public class RESTMapa{
	@Context
	private HttpServletRequest request;

	@Context
	private HttpServletResponse response;
	
	protected void setRequest(HttpServletRequest request) {
		this.request = request;
	}

	@GET
	@Path("/get")
	@Produces({ MediaType.APPLICATION_JSON })
	public Response world() {
	
		float latitude = 0;
		float longitude = 0;

		String chave = "AIzaSyDroa8JCUm2JfRZ_7eVMb4Fqx8ufr0Mz_A";
		 //pegar os dados do mercado aqui pelo id
		    
		   //mandar uma requisicao com o endereco aqui mais a chave
		    r = requests.get("https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key="+chave)
		    if r.status_code == 200:
		    	//tratar o json recebido
		        dados = json.loads(r.content)
		        latitude = dados["results"][0]["geometry"]["location"]["lat"]
		        longitude = dados["results"][0]["geometry"]["location"]["lng"]
		// retornar um json
		return render(request, 'mapa.html', {'latitude':latitude, 'longitude': longitude})
		
		
	}
}





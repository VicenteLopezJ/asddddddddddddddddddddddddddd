package hct.junior.vicente.rest;

import org.springframework.web.bind.annotation.*;
import hct.junior.vicente.model.Cliente;
import hct.junior.vicente.service.ClienteService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@CrossOrigin("*")
@RestController
@RequestMapping("/clientes")
public class ClienteRest {

    private final ClienteService clienteService;

    public ClienteRest(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    public Flux<Cliente> findAll() {
        return clienteService.findAll();
    }

    @GetMapping("/activos")
    public Flux<Cliente> findActivos() {
        return clienteService.findActivos();
    }

    @GetMapping("/eliminados")
    public Flux<Cliente> findEliminados() {
        return clienteService.findEliminados();
    }

    @GetMapping("/{id}")
    public Mono<Cliente> findById(@PathVariable Long id) {
        return clienteService.findById(id);
    }

    @GetMapping("/dni/{dni}")
    public Mono<Cliente> findByDni(@PathVariable String dni) {
        return clienteService.findByDni(dni);
    }

    @PostMapping
    public Mono<Cliente> save(@RequestBody Cliente cliente) {
        return clienteService.save(cliente);
    }

    @PutMapping("/{id}")
    public Mono<Cliente> update(@PathVariable Long id, @RequestBody Cliente cliente) {
        cliente.setId(id);
        return clienteService.update(cliente);
    }

    @PatchMapping("/{id}/deactivate")
    public Mono<Cliente> deactivate(@PathVariable Long id) {
        return clienteService.deactivate(id);
    }

    @PatchMapping("/{id}/activate")
    public Mono<Cliente> activate(@PathVariable Long id) {
        return clienteService.activate(id);
    }

}

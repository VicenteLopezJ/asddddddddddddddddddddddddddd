package hct.junior.vicente.rest;

import org.springframework.web.bind.annotation.*;
import hct.junior.vicente.model.Alquiler;
import hct.junior.vicente.service.AlquilerService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@CrossOrigin("*")
@RestController
@RequestMapping("/alquileres")
public class AlquilerRest {

    private final AlquilerService alquilerService;

    public AlquilerRest(AlquilerService alquilerService) {
        this.alquilerService = alquilerService;
    }

    @GetMapping
    public Flux<Alquiler> findAll() {
        return alquilerService.findAll();
    }

    @GetMapping("/activos")
    public Flux<Alquiler> findActivos() {
        return alquilerService.findActivos();
    }

    @GetMapping("/cancelados")
    public Flux<Alquiler> findCancelados() {
        return alquilerService.findCancelados();
    }

    @GetMapping("/{id}")
    public Mono<Alquiler> findById(@PathVariable Long id) {
        return alquilerService.findById(id);
    }

    @GetMapping("/cliente/{clienteId}")
    public Flux<Alquiler> findByClienteId(@PathVariable Long clienteId) {
        return alquilerService.findByClienteId(clienteId);
    }

    @GetMapping("/vehiculo/{vehiculoId}")
    public Flux<Alquiler> findByVehiculoId(@PathVariable Long vehiculoId) {
        return alquilerService.findByVehiculoId(vehiculoId);
    }

    @GetMapping("/estado/{estado}")
    public Flux<Alquiler> findByEstado(@PathVariable String estado) {
        return alquilerService.findByEstado(estado);
    }

    @PostMapping
    public Mono<Alquiler> save(@RequestBody Alquiler alquiler) {
        return alquilerService.save(alquiler);
    }

    @PutMapping("/{id}")
    public Mono<Alquiler> update(@PathVariable Long id, @RequestBody Alquiler alquiler) {
        return alquilerService.update(id, alquiler);
    }

    @PatchMapping("/{id}/cancel")
    public Mono<Alquiler> cancel(@PathVariable Long id) {
        return alquilerService.cancel(id);
    }

    @PatchMapping("/{id}/restore")
    public Mono<Alquiler> restore(@PathVariable Long id) {
        return alquilerService.restore(id);
    }

}

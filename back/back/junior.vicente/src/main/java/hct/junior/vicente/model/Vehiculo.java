package hct.junior.vicente.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Table("vehiculo")
public class Vehiculo {
    
    @Id
    @Column("id")
    private Long id;

    @Column("placa")
    private String placa;

    @Column("marca")
    private String marca;

    @Column("modelo")
    private String modelo;
    
    @Column("anio")
    private Integer anio;

    @Column("color")
    private String color;

    @Column("precio_por_dia")
    private Double precioPorDia;

    @Column("estado")
    private Boolean estado;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public Integer getAnio() {
        return anio;
    }

    public void setAnio(Integer anio) {
        this.anio = anio;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Double getPrecioPorDia() {
        return precioPorDia;
    }

    public void setPrecioPorDia(Double precioPorDia) {
        this.precioPorDia = precioPorDia;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }
}

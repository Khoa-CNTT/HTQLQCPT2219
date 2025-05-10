package com.example.demotrangoder.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@jakarta.persistence.Table(name = "`table`") // Đảm bảo sử dụng dấu backticks ở đây
public class Table {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tableId;
    private String tableCode;
    private Boolean status;
    private String tableName;
    @OneToMany(mappedBy = "table")
    @JsonIgnore
    private List<CallOderRequest> callOderRequests;
    @Column(name = "isOrdered", columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean isPaid=false;
    public boolean isPaid() {
        return isPaid;
    }

    public void setIsPaid(boolean isPaid) {
        this.isPaid = isPaid;
    }

}
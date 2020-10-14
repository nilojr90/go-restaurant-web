import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const response = await api.get('/foods');
      setFoods(response.data);
    }

    loadFoods();
  }, []);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      // TODO ADD A NEW FOOD PLATE TO THE API
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    //API UPDATE
    console.log(`PATCH: /foods/${editingFood.id}`);
    await api.patch(`/foods/${editingFood.id}`, food)
      .then(response => {
        console.log(response.status);
      })
      .catch(response => {
        console.error(response.status);
      });

    //LOCAL UPDATE
    const updateIndex = foods.findIndex((food) => {
      return food.id === editingFood.id
    });

    let newFoods = foods;

    newFoods[updateIndex].description = food.description;
    newFoods[updateIndex].image = food.image;
    newFoods[updateIndex].price = food.price;
    newFoods[updateIndex].name = food.name;

    setFoods([...newFoods]);
  }

  async function handleDeleteFood(id: number): Promise<void> {
    console.log(`/foods/${id}`);
    console.log(`DELETE: /foods/${id}`);
    await api.delete(`/foods/${id}`)
      .then(response => {
        console.log(response.status);
      })
      .catch(response => {
        console.error(response.status);
      });

    const deleteIndex = foods.findIndex((food) => {
      return food.id === id;
    });

    foods.splice(deleteIndex, 1);
    setFoods([...foods]);
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    setEditingFood(food);
    toggleEditModal();
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;

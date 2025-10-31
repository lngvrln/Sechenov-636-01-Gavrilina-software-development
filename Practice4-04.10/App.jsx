import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
  Alert
} from 'react-native';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const addTask = (text) => {
    if (text.trim()) {
      const newTask = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
        createdAt: new Date()
      };
      setTasks([...tasks, newTask]);
      setInputText('');
      Keyboard.dismiss();
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    Alert.alert(
      'Удаление задачи',
      'Вы уверены, что хотите удалить эту задачу?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => setTasks(tasks.filter(task => task.id !== id))
        }
      ]
    );
  };

  const startEditTask = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEditTask = (id) => {
    if (editText.trim()) {
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, text: editText.trim() } : task
      ));
      setEditingId(null);
      setEditText('');
      Keyboard.dismiss();
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const clearCompleted = () => {
    Alert.alert(
      'Очистка задач',
      'Удалить все выполненные задачи?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: () => setTasks(tasks.filter(task => !task.completed))
        }
      ]
    );
  };

  const getFilteredTasks = () => {
    let filtered = tasks;
    
    if (searchText) {
      filtered = filtered.filter(task =>
        task.text.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    switch (filter) {
      case 'active':
        return filtered.filter(task => !task.completed);
      case 'completed':
        return filtered.filter(task => task.completed);
      default:
        return filtered;
    }
  };

  const getTasksStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;
    
    return { total, completed, active };
  };

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleTask(item.id)}
      >
        <View style={[
          styles.checkboxInner,
          item.completed && styles.checkboxCompleted
        ]}>
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>

      {editingId === item.id ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={editText}
            onChangeText={setEditText}
            autoFocus
            onSubmitEditing={() => saveEditTask(item.id)}
          />
          <View style={styles.editButtons}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={() => saveEditTask(item.id)}
            >
              <Text style={styles.buttonText}>✓</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={cancelEdit}
            >
              <Text style={styles.buttonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.taskContent}>
          <Text style={[
            styles.taskText,
            item.completed && styles.completedTaskText
          ]}>
            {item.text}
          </Text>
          <View style={styles.taskActions}>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => startEditTask(item.id, item.text)}
            >
              <Text style={styles.buttonText}>✎</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={() => deleteTask(item.id)}
            >
              <Text style={styles.buttonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const filteredTasks = getFilteredTasks();
  const stats = getTasksStats();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Менеджер задач</Text>
        <View style={styles.stats}>
          <Text style={styles.statsText}>
            Всего: {stats.total} | Активные: {stats.active} | Выполненные: {stats.completed}
          </Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск задач..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Введите новую задачу..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => addTask(inputText)}
        />
        <TouchableOpacity
          style={[styles.addButton, !inputText.trim() && styles.addButtonDisabled]}
          onPress={() => addTask(inputText)}
          disabled={!inputText.trim()}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        style={styles.taskList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchText ? 'Задачи не найдены' : 'Нет задач'}
          </Text>
        }
      />

      <View style={styles.controls}>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[
              styles.filterButtonText,
              filter === 'all' && styles.filterButtonTextActive
            ]}>
              Все
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'active' && styles.filterButtonActive]}
            onPress={() => setFilter('active')}
          >
            <Text style={[
              styles.filterButtonText,
              filter === 'active' && styles.filterButtonTextActive
            ]}>
              Активные
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
            onPress={() => setFilter('completed')}
          >
            <Text style={[
              styles.filterButtonText,
              filter === 'completed' && styles.filterButtonTextActive
            ]}>
              Выполненные
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[styles.clearButton, stats.completed === 0 && styles.clearButtonDisabled]}
          onPress={clearCompleted}
          disabled={stats.completed === 0}
        >
          <Text style={styles.clearButtonText}>Очистить выполненные</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  stats: {
    backgroundColor: '#34495e',
    padding: 10,
    borderRadius: 8,
  },
  statsText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
  },
  addButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  taskList: {
    flex: 1,
    marginBottom: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#7f8c8d',
  },
  taskActions: {
    flexDirection: 'row',
  },
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  editButtons: {
    flexDirection: 'row',
  },
  button: {
    padding: 6,
    borderRadius: 4,
    marginLeft: 5,
    minWidth: 30,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#f39c12',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  saveButton: {
    backgroundColor: '#27ae60',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: 16,
    marginTop: 50,
  },
  controls: {
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
  },
  filterButtonActive: {
    backgroundColor: '#3498db',
  },
  filterButtonText: {
    color: '#2c3e50',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  clearButton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default App;
#include <v8.h>
#include <node.h>
#include <vector>

using v8::Function;
using v8::FunctionCallbackInfo;
using v8::Handle;
using v8::HandleScope;
using v8::Integer;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::Persistent;
using v8::PersistentHandleVisitor;
using v8::Uint32;
using v8::Value;
using v8::V8;

#ifndef assert
// make some nervous IDEs/vim plugins happy
void assert(bool);
#endif

template <class TypeName>
inline Local<TypeName> PersistentToLocal(Isolate* isolate,
                                         const Persistent<TypeName>* pst) {
  if (pst->IsWeak()) {
    return Local<TypeName>::New(isolate, *pst);
  } else {
    return *reinterpret_cast<Local<TypeName>*>(
        const_cast<Persistent<TypeName>*>(pst));
  }
}

class PersistentHandleWithClassId {
  public:
    PersistentHandleWithClassId(Isolate* isolate, uint32_t id, Local<Object> value)
      : id_(id){
      obj_p_.Reset(isolate, value);
    }

    ~PersistentHandleWithClassId() {
      obj_p_.Reset();
    }

    Local<Object> value() {
      return PersistentToLocal(isolate_, &obj_p_);
    }

    uint32_t id() {
      return id_;
    }

  private:
    uint32_t id_;
    Persistent<Object> obj_p_;
    Isolate* isolate_;
};

class PersistentHandleWithClassIdVisitor : public PersistentHandleVisitor {
  public:
    PersistentHandleWithClassIdVisitor(Isolate* isolate,
                                       Local<Function> fn,
                                       uint32_t ids)
        : ids_(ids) {
      fn_p_.Reset(isolate, fn);
    };

    ~PersistentHandleWithClassIdVisitor() {
      fn_p_.Reset();
      for (auto h : handles_) {
        delete h;
      }
      handles_.clear();
    }

    virtual void VisitPersistentHandle(Persistent<Value>* value,
                                       uint16_t class_id) {
      Isolate* isolate = Isolate::GetCurrent();
      HandleScope handle_scope(isolate);

      // class_id adjustment for AsyncWrap
      if (class_id >= 0xA1C && class_id < 0xA1C + 100)
        class_id = class_id - 0xA1C;

      if (!((1 << class_id) & ids_))
        return;

      Local<Value> val = PersistentToLocal(isolate, value);

      if (val.IsEmpty() || !val->IsObject())
        return;

      Local<Object> obj = val.As<Object>();
      add_(isolate, class_id, obj);
    }

    void report_handles(Isolate* isolate) {
      Local<Function> fn = PersistentToLocal(isolate, &fn_p_).As<Function>();
      for (auto h : handles_) {
        report_(isolate, fn, h);
      }
    }

  private:
    Persistent<Function> fn_p_;
    const uint32_t ids_;
    std::vector<PersistentHandleWithClassId*> handles_;

    void add_(Isolate* isolate, uint32_t id, Local<Object> value) {
      PersistentHandleWithClassId* handle = new PersistentHandleWithClassId(isolate, id, value);
      handles_.push_back(handle);
    }

    void report_(Isolate* isolate, Local<Function> fn, PersistentHandleWithClassId* handle) {
      Local<Value> argv[] = { Integer::New(isolate, handle->id()), handle->value() };
      fn->Call(Null(isolate), 2, argv);
    }
};

static void Visit(const FunctionCallbackInfo<Value>& info) {
  Isolate* isolate = info.GetIsolate();

  assert(info[0]->IsFunction());
  assert(info[1]->IsUint32());

  PersistentHandleWithClassIdVisitor visitor(isolate,
                                             info[0].As<Function>(),
                                             info[1]->Uint32Value());
  // This function introduced with v8 v3.30.37 upgrade Nov 13, 2014
  // (https://github.com/nodesource/nsolid-node/commit/5d1b6d3e0fa4b97a490ef964be48aed9872e3ec1)
  // before that it was V8::VisitHandlesWithClassIds(isolate, &visitor).
  isolate->VisitHandlesWithClassIds(&visitor);
  visitor.report_handles(isolate);
}

static void InitVisitor(Handle<Object> exports) {
  NODE_SET_METHOD(exports, "visit", Visit);
}

NODE_MODULE(persistents_with_classid, InitVisitor)
